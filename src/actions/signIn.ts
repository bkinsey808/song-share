"use server";

import { Schema as S } from "@effect/schema";
import { Either } from "effect";
import { doc, getDoc } from "firebase/firestore";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { encodeSessionToken } from "@/features/auth/encodeSessionToken";
import { SignInResultType } from "@/features/auth/enums";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { SessionCookieData } from "@/features/auth/types";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { UserDoc } from "@/features/firebase/types";

export type SignInResult =
	| { signInResultType: SignInResultType.NEW }
	| { signInResultType: SignInResultType.ERROR; message: string }
	| {
			signInResultType: SignInResultType.EXISTING;
			userData: SessionCookieData;
			songs: UserDoc["songs"];
	  };

export const signIn = async (email: string): Promise<SignInResult> => {
	const existingUserDoc =
		email === null ? undefined : await getDoc(doc(db, "users", email));

	if (!existingUserDoc?.exists()) {
		console.log("No existing user");

		return { signInResultType: SignInResultType.NEW };
	}

	const existingUserDocData = existingUserDoc.data();

	const existingUserDocResult =
		S.decodeUnknownEither(UserDocSchema)(existingUserDocData);

	if (Either.isLeft(existingUserDocResult)) {
		console.error("UserDoc data is invalid", existingUserDocResult.left);
		return {
			signInResultType: SignInResultType.ERROR,
			message: "UserDoc data is invalid",
		};
	}

	const sessionCookieData: SessionCookieData = {
		email,
		...existingUserDocResult.right,
		picture: existingUserDocResult.right.picture ?? null,
	};

	const sessionToken = await encodeSessionToken(sessionCookieData);

	cookies().set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

	return {
		signInResultType: SignInResultType.EXISTING,
		userData: sessionCookieData,
		songs: existingUserDocResult.right.songs,
	};
};
