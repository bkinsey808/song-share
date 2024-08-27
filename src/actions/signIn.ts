"use server";

import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { signInResultType } from "@/features/auth/consts";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { sessionTokenEncode } from "@/features/auth/sessionTokenEncode";
import { sessionWarningTimestampGet } from "@/features/auth/sessionWarningTimestampGet";
import { SessionCookieData } from "@/features/auth/types";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import {
	PublicUserDocSchema,
	UserDocSchema,
} from "@/features/firebase/schemas";
import { serverParse } from "@/features/global/serverParse";

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export const signIn = async (uid: string) => {
	try {
		const existingUserSnapshot = await db
			.collection(collection.USERS)
			.doc(uid)
			.get();

		if (!existingUserSnapshot.exists) {
			console.warn("No existing user");

			return { signInResultType: signInResultType.NEW };
		}

		const existingUserDocData = existingUserSnapshot.data();

		const existingUserDocResult = serverParse(
			UserDocSchema,
			existingUserDocData,
		);

		if (!existingUserDocResult.success) {
			console.error(
				"UserDoc data is invalid",
				JSON.stringify(existingUserDocResult.issues, null, 2),
			);
			return {
				signInResultType: signInResultType.ERROR,
				message: "UserDoc data is invalid",
			};
		}

		const existingPublicUserSnapshot = await db
			.collection(collection.PUBLIC_USERS)
			.doc(uid)
			.get();

		if (!existingUserSnapshot.exists) {
			console.warn("No existing user");

			return { signInResultType: signInResultType.NEW };
		}

		const existingPublicUserDocData = existingPublicUserSnapshot.data();

		const existingPublicUserDocResult = serverParse(
			PublicUserDocSchema,
			existingPublicUserDocData,
		);

		if (!existingPublicUserDocResult.success) {
			console.error(
				"PublicUserDoc data is invalid",
				JSON.stringify(existingPublicUserDocResult.issues, null, 2),
			);
			return {
				signInResultType: signInResultType.ERROR,
				message: "PublicUserDoc data is invalid",
			};
		}

		const sessionCookieData: SessionCookieData = {
			uid,
			...existingUserDocResult.output,
			...existingPublicUserDocResult.output,
			picture: existingPublicUserDocResult.output.picture ?? null,
			sessionWarningTimestamp: sessionWarningTimestampGet(),
		};

		const sessionToken = await sessionTokenEncode(sessionCookieData);

		cookies().set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

		const { songId, songSetId, songIds, songSetIds } =
			existingUserDocResult.output;
		const { activeSongId, activeSongSetId } =
			existingPublicUserDocResult.output;

		return {
			signInResultType: signInResultType.EXISTING,
			userData: sessionCookieData,
			songIds,
			songSetIds,
			songId,
			songSetId,
			activeSongId,
			activeSongSetId,
		};
	} catch (error) {
		console.error({ error });

		return {
			signInResultType: signInResultType.ERROR,
			message: "Failed to sign in",
		};
	}
};
