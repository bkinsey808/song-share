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
import { UserDoc } from "@/features/firebase/types";
import { serverParse } from "@/features/global/serverParse";

export type SignInResult =
	| { signInResultType: SignInResultType.NEW }
	| { signInResultType: SignInResultType.ERROR; message: string }
	| {
			signInResultType: SignInResultType.EXISTING;
			userData: SessionCookieData;
			songs: UserDoc["songSets"];
	  };

export const signIn = async (email: string): Promise<SignInResult> => {
	const existingUserDoc =
		email === null ? undefined : await getDoc(doc(db, "users", email));

	if (!existingUserDoc?.exists()) {
		console.log("No existing user");

		return { signInResultType: SignInResultType.NEW };
	}

	const existingUserDocData = existingUserDoc.data();

	const existingUserDocResult = serverParse(UserDocSchema, existingUserDocData);

	if (!existingUserDocResult.success) {
		console.error("UserDoc data is invalid", existingUserDocResult.issues);
		return {
			signInResultType: SignInResultType.ERROR,
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
		signInResultType: SignInResultType.EXISTING,
		userData: sessionCookieData,
		songs: existingUserDocResult.output.songSets,
	};
};
