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
import { dbServer } from "@/features/firebase/firebaseServer";
import { UserDoc } from "@/features/firebase/types";
import { serverParse } from "@/features/global/serverParse";

export const register = async ({
	email,
	picture,
	registrationData,
}: {
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
			doc(dbServer, "usernames", username),
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
			picture: picture ?? null,
			username,
			songs: {},
			songSets: {},
			roles: [],
			activeSongId: null,
			activeSongSetId: null,
			songId: null,
			songSetId: null,
		};

		const sessionCookieData: SessionCookieData = {
			email,
			...userDoc,
			picture: picture ?? null,
			sessionWarningTimestamp: sessionWarningTimestampGet(),
		};

		await setDoc(doc(dbServer, "users", email), userDoc);
		await setDoc(doc(dbServer, "usernames", username), {
			email,
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
