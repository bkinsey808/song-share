"use server";

import { doc, getDoc } from "firebase/firestore";
import { cookies } from "next/headers";

import { getSong } from "./getSong";
import { getSongSet } from "./getSongSet";
import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { signInResultType } from "@/features/auth/consts";
import { encodeSessionToken } from "@/features/auth/encodeSessionToken";
import { getSessionWarningTimestamp } from "@/features/auth/getSessionWarningTimestamp";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { SessionCookieData } from "@/features/auth/types";
import { db } from "@/features/firebase/firebase";
import { UserDocSchema } from "@/features/firebase/schemas";
import { serverParse } from "@/features/global/serverParse";

const songOrThrow = async (songId: string | null) => {
	if (!songId) {
		return null;
	}

	const songResult = await getSong(songId);
	if (songResult.actionResultType === actionResultType.ERROR) {
		throw new Error("Failed to get song");
	}

	return songResult.song;
};

const songSetOrThrow = async (songSetId: string | null) => {
	if (!songSetId) {
		return null;
	}

	const songSetResult = await getSongSet(songSetId);
	if (songSetResult.actionResultType === actionResultType.ERROR) {
		throw new Error("Failed to get song set");
	}

	return songSetResult.songSet;
};

export const signIn = async (email: string) => {
	try {
		const existingUserDoc =
			email === null ? undefined : await getDoc(doc(db, "users", email));

		if (!existingUserDoc?.exists()) {
			console.warn("No existing user");

			return { signInResultType: signInResultType.NEW };
		}

		const existingUserDocData = existingUserDoc.data();

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

		const sessionCookieData: SessionCookieData = {
			email,
			...existingUserDocResult.output,
			picture: existingUserDocResult.output.picture ?? null,
			sessionWarningTimestamp: getSessionWarningTimestamp(),
		};

		const sessionToken = await encodeSessionToken(sessionCookieData);

		cookies().set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

		const {
			songId,
			songSetId,
			activeSongId,
			activeSongSetId,
			songs,
			songSets,
		} = existingUserDocResult.output;

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
