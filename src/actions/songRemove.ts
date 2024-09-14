"use server";

import { safeParse } from "valibot";

import { playlistGet } from "./playlistGet";
import { sessionExtend } from "./sessionExtend";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { Playlist } from "@/features/sections/playlist/types";
import { SongSchema } from "@/features/sections/song/schemas";
import { Song } from "@/features/sections/song/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songRemove = async ({
	songId,
	playlistId,
}: {
	songId: string;
	playlistId: string;
}) => {
	try {
		const sessionExtendResult = await sessionExtend();
		if (sessionExtendResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { uid } = sessionExtendResult.sessionCookieData;

		const playlistResult = await playlistGet(playlistId);
		if (playlistResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song set not found");
		}

		const { playlist } = playlistResult;
		if (playlist.sharer !== uid) {
			return actionErrorMessageGet(
				"You are not authorized to remove this song",
			);
		}

		const newSongIds = playlist.songIds.filter((id) => id !== songId);
		const newPlaylist: Playlist = {
			...playlist,
			songIds: newSongIds,
		};

		await db.collection(collection.SONG_SETS).doc(playlistId).update({
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
		const newPlaylistIds = song.playlistIds.filter((id) => id !== playlistId);
		const newSong: Song = {
			...song,
			playlistIds: newPlaylistIds,
		};
		await db.collection(collection.SONGS).doc(songId).update({
			playlistIds: newPlaylistIds,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			playlist: newPlaylist,
			song: newSong,
		};
	} catch (error) {
		console.error(error);
		return actionErrorMessageGet("An error occurred");
	}
};
