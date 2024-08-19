"use server";

import { doc, getDoc } from "firebase/firestore";
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
import { dbServer } from "@/features/firebase/firebaseServer";
import { UserDocSchema } from "@/features/firebase/schemas";
import { serverParse } from "@/features/global/serverParse";

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

export const signIn = async (email: string) => {
	try {
		const existingUserDoc =
			email === null ? undefined : await getDoc(doc(dbServer, "users", email));

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
			sessionWarningTimestamp: sessionWarningTimestampGet(),
		};

		const sessionToken = await sessionTokenEncode(sessionCookieData);

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
