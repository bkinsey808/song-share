"use server";

import { safeParse } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { songSetGet } from "./songSetGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { SongSet } from "@/features/sections/song-set/types";
import { SongSchema } from "@/features/sections/song/schemas";
import { Song } from "@/features/sections/song/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songRemove = async ({
	songId,
	songSetId,
}: {
	songId: string;
	songSetId: string;
}) => {
	try {
		const sessionExtendResult = await sessionExtend();
		if (sessionExtendResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { uid } = sessionExtendResult.sessionCookieData;

		const songSetResult = await songSetGet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song set not found");
		}

		const { songSet } = songSetResult;
		if (songSet.sharer !== uid) {
			return actionErrorMessageGet(
				"You are not authorized to remove this song",
			);
		}

		const newSongIds = songSet.songIds.filter((id) => id !== songId);
		const newSongSet: SongSet = {
			...songSet,
			songIds: newSongIds,
		};

		await db.collection(collection.SONG_SETS).doc(songSetId).update({
			songIds: newSongIds,
		});

		const songResult = await db.collection(collection.SONGS).doc(songId).get();
		if (!songResult.exists) {
			return actionErrorMessageGet("Song not found");
		}
		const songData = songResult.data();
		if (!songData) {
			return actionErrorMessageGet("No data found for song");
		}
		const songParseResult = safeParse(SongSchema, songData);
		if (!songParseResult.success) {
			return actionErrorMessageGet("Invalid data for song");
		}
		const song = songParseResult.output;
		const newSongSetIds = song.songSetIds.filter((id) => id !== songSetId);
		const newSong: Song = {
			...song,
			songSetIds: newSongSetIds,
		};
		await db.collection(collection.SONGS).doc(songId).update({
			songSetIds: newSongSetIds,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			songSet: newSongSet,
			song: newSong,
		};
	} catch (error) {
		console.error(error);
		return actionErrorMessageGet("An error occurred");
	}
};
