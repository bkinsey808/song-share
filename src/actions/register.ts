"use server";

import { doc, getDoc, setDoc } from "firebase/firestore";
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
import { db } from "@/features/firebase/firebase";
import { PublicUserDoc, UserDoc } from "@/features/firebase/types";
import { serverParse } from "@/features/global/serverParse";

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

		const existingUsernameDocumentSnapshot = await getDoc(
			doc(db, "usernames", username),
		);
		if (existingUsernameDocumentSnapshot.exists()) {
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
			songs: {},
			songSets: {},
			roles: [],
			songId: null,
			songSetId: null,
		};

		const publicUserDoc: PublicUserDoc = {
			username,
			picture: picture ?? null,
			activeSongId: null,
			activeSongSetId: null,
		};

		const sessionCookieData: SessionCookieData = {
			...userDoc,
			...publicUserDoc,
			uid,
			picture: picture ?? null,
			sessionWarningTimestamp: sessionWarningTimestampGet(),
		};

		await setDoc(doc(db, "users", uid), userDoc);
		await setDoc(doc(db, "publicUsers", uid), publicUserDoc);
		await setDoc(doc(db, "usernames", username), {
			uid,
		});

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
