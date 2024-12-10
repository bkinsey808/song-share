"use server";

import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songDelete = async (songId: string) => {
	try {
		if (!songId) {
			return actionErrorMessageGet("Song ID is required");
		}

		const sessionExtendResult = await sessionExtend();
		if (sessionExtendResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { uid } = sessionExtendResult.sessionCookieData;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("User not found");
		}
		const { userDoc } = userDocResult;
		const userDocSongIds = userDoc.songIds ?? [];

		const songResult = await songGet(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			return songResult;
		}
		const { song } = songResult;

		if (song.sharer !== uid) {
			return actionErrorMessageGet("User does not own this song");
		}

		// delete from the playlists collection
		const playlistIds = song.playlistIds;
		const deletePlaylistPromises =
			playlistIds?.map((playlistId) =>
				db.collection(collection.PLAYLISTS).doc(playlistId).delete(),
			) ?? [];
		const promiseResult = await Promise.allSettled(deletePlaylistPromises);
		const failedPlaylistDeletes = promiseResult.filter(
			(result) => result.status === "rejected",
		);
		if (failedPlaylistDeletes.length > 0) {
			return actionErrorMessageGet("Failed to delete playlists");
		}

		// delete from the songLogs collection
		const songLogsQuerySnapshot = await db
			.collection(collection.SONG_LOGS)
			.where("songId", "==", songId)
			.get();

		const deleteSongLogsPromises = songLogsQuerySnapshot.docs.map((doc) =>
			doc.ref.delete(),
		);

		const songLogsPromiseResult = await Promise.allSettled(
			deleteSongLogsPromises,
		);
		const failedSongLogsDeletes = songLogsPromiseResult.filter(
			(result) => result.status === "rejected",
		);

		if (failedSongLogsDeletes.length > 0) {
			return actionErrorMessageGet("Failed to delete song logs");
		}

		// delete the song form the songs collection
		await db.collection(collection.SONGS).doc(songId).delete();

		const songIds = userDocSongIds.filter((id) => id !== songId);

		// update user doc songs with the deleted song removed
		await db.collection(collection.USERS).doc(uid).update({
			songIds,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			songIds,
		};
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Failed to delete song");
	}
};
