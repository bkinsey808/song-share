"use server";

import { doc, getDoc } from "firebase/firestore";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { encodeSessionToken } from "@/features/auth/encodeSessionToken";
import { SignInResultType } from "@/features/auth/enums";
import { getSessionWarningTimestamp } from "@/features/auth/getSessionWarningTimestamp";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { SessionCookieData } from "@/features/auth/types";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { serverParse } from "@/features/global/serverParse";

export const signIn = async (email: string) => {
	const existingUserDoc =
		email === null ? undefined : await getDoc(doc(db, "users", email));

	if (!existingUserDoc?.exists()) {
		console.log("No existing user");

		return { signInResultType: SignInResultType.NEW as const };
	}

	const existingUserDocData = existingUserDoc.data();

	const existingUserDocResult = serverParse(UserDocSchema, existingUserDocData);

	if (!existingUserDocResult.success) {
		console.error(
			"UserDoc data is invalid",
			JSON.stringify(existingUserDocResult.issues, null, 2),
		);
		return {
			signInResultType: SignInResultType.ERROR as const,
			message: "UserDoc data is invalid",
		};
	}

	const sessionCookieData: SessionCookieData = {
		email,
		...existingUserDocResult.output,
		picture: existingUserDocResult.output.picture ?? null,
		sessionWarningTimestamp: getSessionWarningTimestamp(),
	};

	const sessionToken = await encodeSessionToken(sessionCookieData);

	cookies().set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

	return {
		signInResultType: SignInResultType.EXISTING as const,
		userData: sessionCookieData,
		songs: existingUserDocResult.output.songSets,
	};
};
