"use server";

import { cookies } from "next/headers";

import { sessionCookieGet } from "./sessionCookieGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const accountDelete = async () => {
	try {
		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const sessionCookieData = cookieResult.sessionCookieData;
		const { uid, username } = sessionCookieData;
		if (!username) {
			return actionErrorMessageGet("Username is not defined");
		}

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Error getting user doc");
		}
		const { userDoc } = userDocResult;

		const songIds = userDoc.songIds;
		const deleteSongPromises = songIds.map((songId) =>
			db.collection(Collection.SONGS).doc(songId).delete(),
		);
		const promiseSongsAllSettledResult =
			await Promise.allSettled(deleteSongPromises);

		// check to see if any of the song deletes failed
		const failedSongDeletes = promiseSongsAllSettledResult.filter(
			(result) => result.status === "rejected",
		);
		if (failedSongDeletes.length > 0) {
			return actionErrorMessageGet("Failed to delete songs");
		}

		const playlistIds = userDoc.playlistIds;
		const deletePlaylistPromises = (playlistIds ?? []).map((playlistId) =>
			db.collection(Collection.PLAYLISTS).doc(playlistId).delete(),
		);
		const promisePlaylistsAllSettledResult = await Promise.allSettled(
			deletePlaylistPromises,
		);

		// check to see if any of the song deletes failed
		const failedPlaylistsDeletes = promisePlaylistsAllSettledResult.filter(
			(result) => result.status === "rejected",
		);
		if (failedPlaylistsDeletes.length > 0) {
			return actionErrorMessageGet("Failed to delete playlists");
		}

		await db.collection(Collection.USERS).doc(uid).delete();
		await db.collection(Collection.USERS_PUBLIC).doc(uid).delete();
		await db.collection(Collection.USER_NAMES).doc(username).delete();

		(await cookies()).delete(SESSION_COOKIE_NAME);

		return { actionResultType: actionResultType.SUCCESS };
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Error deleting account");
	}
};
