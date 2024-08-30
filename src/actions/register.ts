"use server";

import { cookies } from "next/headers";
import { flatten } from "valibot";

import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { registerFormFieldKey } from "@/features/auth/consts";
import { RegistrationSchema } from "@/features/auth/schemas";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { sessionTokenEncode } from "@/features/auth/sessionTokenEncode";
import { sessionWarningTimestampGet } from "@/features/auth/sessionWarningTimestampGet";
import { RegistrationData, SessionCookieData } from "@/features/auth/types";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { UserDoc, UserPublicDoc } from "@/features/firebase/types";
import { serverParse } from "@/features/global/serverParse";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const register = async ({
	uid,
	email,
	picture,
	registrationData,
}: {
	uid: string;
	email: string;
	picture: string | null;
	registrationData: RegistrationData;
}) => {
	try {
		const result = serverParse(RegistrationSchema, registrationData);
		if (!result.success) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: flatten<typeof RegistrationSchema>(result.issues).nested,
			};
		}

		const username = registrationData[registerFormFieldKey.Username];

		const usernameSnapshot = await db
			.collection(collection.USER_NAMES)
			.doc(username)
			.get();
		if (usernameSnapshot.exists) {
			return {
				actionResultType: actionResultType.ERROR,
				fieldErrors: {
					[registerFormFieldKey.Username]: ["Username is already taken"],
				},
			};
		}

		const userDoc: UserDoc = {
			...registrationData,
			email,
			songIds: [],
			songSetIds: [],
			roles: [],
			songId: null,
			songSetId: null,
		};

		const userPublicDoc: UserPublicDoc = {
			username,
			picture: picture ?? null,
			songActiveId: null,
			songSetActiveId: null,
		};

		const sessionCookieData: SessionCookieData = {
			...userDoc,
			...userPublicDoc,
			uid,
			picture: picture ?? null,
			sessionWarningTimestamp: sessionWarningTimestampGet(),
		};

		await db.collection(collection.USERS).doc(uid).set(userDoc);
		await db.collection(collection.USERS_PUBLIC).doc(uid).set(userPublicDoc);
		await db.collection(collection.USER_NAMES).doc(username).set({ uid });

		const sessionToken = await sessionTokenEncode(sessionCookieData);

		cookies().set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

		return {
			actionResultType: actionResultType.SUCCESS,
			sessionCookieData,
		};
	} catch (error) {
		console.error({ error });
		return {
			actionResultType: actionResultType.ERROR,
			formError: "Failed to register",
		};
	}
};
