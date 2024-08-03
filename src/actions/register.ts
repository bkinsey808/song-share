"use server";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { flatten } from "valibot";

import { ActionResultType } from "@/features/app-store/enums";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { encodeSessionToken } from "@/features/auth/encodeSessionToken";
import { RegisterFormFieldKey } from "@/features/auth/enums";
import { getSessionWarningTimestamp } from "@/features/auth/getSessionWarningTimestamp";
import { RegistrationSchema } from "@/features/auth/schemas";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { RegistrationData, SessionCookieData } from "@/features/auth/types";
import { db } from "@/features/firebase/firebase";
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
				actionResultType: ActionResultType.ERROR as const,
				fieldErrors: flatten<typeof RegistrationSchema>(result.issues).nested,
			};
		}

		const username = registrationData[RegisterFormFieldKey.Username];

		const existingUsernameDocumentSnapshot = await getDoc(
			doc(db, "usernames", username),
		);
		if (existingUsernameDocumentSnapshot.exists()) {
			return {
				actionResultType: ActionResultType.ERROR as const,
				fieldErrors: {
					[RegisterFormFieldKey.Username]: ["Username is already taken"],
				},
			};
		}

		const userDoc: UserDoc = {
			...registrationData,
			picture: picture ?? undefined,
			username,
			songs: {},
			songSets: {},
			roles: [],
		};

		const sessionCookieData: SessionCookieData = {
			email,
			...userDoc,
			picture: picture ?? null,
			sessionWarningTimestamp: getSessionWarningTimestamp(),
		};

		await setDoc(doc(db, "users", email), userDoc);
		await setDoc(doc(db, "usernames", username), {
			email,
		});

		const sessionToken = await encodeSessionToken(sessionCookieData);

		cookies().set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

		return {
			actionResultType: ActionResultType.SUCCESS as const,
			sessionCookieData,
		};
	} catch (error) {
		console.error({ error });
		return {
			actionResultType: ActionResultType.ERROR as const,
			formError: "Failed to register",
		};
	}
};
