"use server";

import { cookies } from "next/headers";

import { sessionCookieGet } from "./sessionCookieGet";
import { userDocGet } from "./userDocGet";
import { ActionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const accountDelete = async (): Promise<{
	actionResultType: keyof typeof ActionResultType;
}> => {
	try {
		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const sessionCookieData = cookieResult.sessionCookieData;
		const { uid, username } = sessionCookieData;
		if (!username) {
			return actionErrorMessageGet("Username is not defined");
		}

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Error getting user doc");
		}
		const { userDoc } = userDocResult;

		const songIds = userDoc.songIds;
		console.log({ songIds });
		// const deleteSongPromises = songIds.map((songId) =>
		// 	db.collection(Collection.SONGS).doc(songId).delete(),
		// );
		// const promiseSongsAllSettledResult =
		// 	await Promise.allSettled(deleteSongPromises);

		// // check to see if any of the song deletes failed
		// const failedSongDeletes = promiseSongsAllSettledResult.filter(
		// 	(result) => result.status === "rejected",
		// );
		// if (failedSongDeletes.length > 0) {
		// 	return actionErrorMessageGet("Failed to delete songs");
		// }

		// const playlistIds = userDoc.playlistIds;
		// const deletePlaylistPromises = (playlistIds ?? []).map((playlistId) =>
		// 	db.collection(Collection.PLAYLISTS).doc(playlistId).delete(),
		// );
		// const promisePlaylistsAllSettledResult = await Promise.allSettled(
		// 	deletePlaylistPromises,
		// );

		// check to see if any of the song deletes failed
		// const failedPlaylistsDeletes = promisePlaylistsAllSettledResult.filter(
		// 	(result) => result.status === "rejected",
		// );
		// if (failedPlaylistsDeletes.length > 0) {
		// 	return actionErrorMessageGet("Failed to delete playlists");
		// }

		await db.collection(collectionNameGet(collection.USERS)).doc(uid).delete();
		await db
			.collection(collectionNameGet(collection.USERS_PUBLIC))
			.doc(uid)
			.delete();
		await db
			.collection(collectionNameGet(collection.USER_NAMES))
			.doc(username)
			.delete();

		(await cookies()).delete(SESSION_COOKIE_NAME);

		return { actionResultType: ActionResultType.SUCCESS };
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Error deleting account");
	}
};
