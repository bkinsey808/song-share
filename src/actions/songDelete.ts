"use server";

import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { userDocGet } from "./userDocGet";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

type SongDelete = (songId: string) => Promise<
	| {
			actionResultType: "SUCCESS";
			songIds: string[];
	  }
	| {
			actionResultType: "ERROR";
			message: string;
	  }
>;

export const songDelete: SongDelete = async (songId) => {
	try {
		if (!songId) {
			return actionErrorMessageGet("Song ID is required");
		}

		const sessionExtendResult = await sessionExtend();
		if (sessionExtendResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { uid } = sessionExtendResult.sessionCookieData;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("User not found");
		}
		const { userDoc } = userDocResult;
		const userDocSongIds = userDoc.songIds ?? [];

		const songResult = await songGet(songId);
		if (songResult.actionResultType === ActionResultType.ERROR) {
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
				db
					.collection(collectionNameGet(collection.PLAYLISTS))
					.doc(playlistId)
					.delete(),
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
			.collection(collectionNameGet(collection.SONG_LOGS))
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
		await db
			.collection(collectionNameGet(collection.SONGS))
			.doc(songId)
			.update({ deleted: true });

		const songIds = userDocSongIds.filter((id) => id !== songId);

		// update user doc songs with the deleted song removed
		await db.collection(collectionNameGet(collection.USERS)).doc(uid).update({
			songIds,
		});

		return {
			actionResultType: ActionResultType.SUCCESS,
			songIds,
		};
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Failed to delete song");
	}
};
