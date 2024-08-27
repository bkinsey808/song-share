"use server";

import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { songSetGet } from "./songSetGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { SongSet } from "@/features/sections/song-set/types";
import { Song } from "@/features/sections/song/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songAddToSongSet = async ({
	songId,
	songSetId,
}: {
	songId: string;
	songSetId: string;
}) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		const songResult = await songGet(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song not found");
		}
		const existingSong = songResult.song;

		const songSetResult = await songSetGet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song set not found");
		}
		const existingSongSet = songSetResult.songSet;

		if (existingSongSet.sharer !== uid) {
			return actionErrorMessageGet(
				"You are not authorized to add to this song",
			);
		}

		const songSetSongIds = existingSongSet.songIds;
		const newSongSet: SongSet = {
			...existingSongSet,
			songIds: songSetSongIds ? [...songSetSongIds, songId] : [songId],
		};

		const newSong: Song = {
			...existingSong,
			songSetIds: existingSong.songSetIds
				? [...existingSong.songSetIds, songSetId]
				: [songSetId],
		};

		await db.collection(collection.SONGS).doc(songId).update({
			songSetIds: newSong.songSetIds,
		});
		await db.collection(collection.SONG_SETS).doc(songSetId).update({
			songIds: newSongSet.songIds,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			song: newSong,
			songSet: newSongSet,
		};
	} catch (error) {
		return actionErrorMessageGet("Failed to add song to song set");
	}
};
