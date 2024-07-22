"use server";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { flatten, safeParse } from "valibot";

import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { encodeSessionToken } from "@/features/auth/encodeSessionToken";
import {
	RegisterFormFieldKey,
	RegisterResultType,
} from "@/features/auth/enums";
import { getSessionWarningTimestamp } from "@/features/auth/getSessionWarningTimestamp";
import { RegistrationSchema } from "@/features/auth/schemas";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { RegistrationData, SessionCookieData } from "@/features/auth/types";
import { db } from "@/features/firebase/firebase";
import { UserDoc } from "@/features/firebase/types";

export type RegisterResult =
	| {
			registerResultType: RegisterResultType.SUCCESS;
			sessionCookieData: SessionCookieData;
	  }
	| {
			registerResultType: RegisterResultType.ERROR;
			formError?: string;
			fieldErrors?:
				| {
						[fieldKey in RegisterFormFieldKey]?: string[];
				  }
				| undefined;
	  };

export const register = async ({
	email,
	picture,
	registrationData,
}: {
	email: string;
	picture: string | null;
	registrationData: RegistrationData;
}): Promise<RegisterResult> => {
	try {
		const result = safeParse(RegistrationSchema, registrationData);
		if (!result.success) {
			return {
				registerResultType: RegisterResultType.ERROR,
				fieldErrors: flatten<typeof RegistrationSchema>(result.issues).nested,
			};
		}

		const username = registrationData[RegisterFormFieldKey.Username];

		const existingUsernameDocumentSnapshot = await getDoc(
			doc(db, "usernames", username),
		);
		if (existingUsernameDocumentSnapshot.exists()) {
			return {
				registerResultType: RegisterResultType.ERROR,
				fieldErrors: {
					[RegisterFormFieldKey.Username]: ["Username is already taken"],
				},
			};
		}

		const userDoc: UserDoc = {
			...registrationData,
			picture,
			username,
			songs: {},
			roles: [],
		};

		const sessionCookieData: SessionCookieData = {
			email,
			...userDoc,
			sessionWarningTimestamp: getSessionWarningTimestamp(),
		};

		await setDoc(doc(db, "users", email), userDoc);
		await setDoc(doc(db, "usernames", username), {
			email,
		});

		const sessionToken = await encodeSessionToken(sessionCookieData);

		cookies().set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

		return {
			registerResultType: RegisterResultType.SUCCESS,
			sessionCookieData,
		};
	} catch (error) {
		console.error({ error });
		return {
			registerResultType: RegisterResultType.ERROR,
			formError: "Failed to register",
		};
	}
};
