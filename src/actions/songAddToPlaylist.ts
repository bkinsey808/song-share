"use server";

import { playlistGet } from "./playlistGet";
import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { Playlist } from "@/features/sections/playlist/types";
import { Song } from "@/features/sections/song/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songAddToPlaylist = async ({
	songId,
	playlistId,
}: {
	songId: string;
	playlistId: string;
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

		const playlistResult = await playlistGet(playlistId);
		if (playlistResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Playlist not found");
		}
		const existingPlaylist = playlistResult.playlist;

		if (existingPlaylist.sharer !== uid) {
			return actionErrorMessageGet(
				"You are not authorized to add to this song",
			);
		}

		const playlistSongs = existingPlaylist.songs;
		const newPlaylist: Playlist = {
			...existingPlaylist,
			songs: playlistSongs ? [...playlistSongs, { songId }] : [{ songId }],
		};

		const newSong: Song = {
			...existingSong,
			playlistIds: existingSong.playlistIds
				? Array.from(new Set([...existingSong.playlistIds, playlistId]))
				: [playlistId],
		};

		await db.collection(collection.SONGS).doc(songId).update({
			playlistIds: newSong.playlistIds,
		});
		await db.collection(collection.SONG_SETS).doc(playlistId).update({
			songs: newPlaylist.songs,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			song: newSong,
			playlist: newPlaylist,
		};
	} catch (error) {
		return actionErrorMessageGet("Failed to add song to playlist");
	}
};
