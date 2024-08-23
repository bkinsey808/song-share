"use server";

import { cookies } from "next/headers";

import { songGet } from "./songGet";
import { songSetGet } from "./songSetGet";
import { actionResultType } from "@/features/app-store/consts";
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

const songOrThrow = async (songId: string | null) => {
	if (!songId) {
		return null;
	}

	const songResult = await songGet(songId);
	if (songResult.actionResultType === actionResultType.ERROR) {
		throw new Error("Failed to get song");
	}

	return songResult.song;
};

const songSetOrThrow = async (songSetId: string | null) => {
	if (!songSetId) {
		return null;
	}

	const songSetResult = await songSetGet(songSetId);
	if (songSetResult.actionResultType === actionResultType.ERROR) {
		throw new Error("Failed to get song set");
	}

	return songSetResult.songSet;
};

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

		const { songId, songSetId, songs, songSets } = existingUserDocResult.output;
		const { activeSongId, activeSongSetId } =
			existingPublicUserDocResult.output;

		return {
			signInResultType: signInResultType.EXISTING,
			userData: sessionCookieData,
			songs,
			songSets,
			songId,
			songSetId,
			activeSongId,
			activeSongSetId,
			song: await songOrThrow(songId),
			songSet: await songSetOrThrow(songSetId),
		};
	} catch (error) {
		console.error({ error });

		return {
			signInResultType: signInResultType.ERROR,
			message: "Failed to sign in",
		};
	}
};
