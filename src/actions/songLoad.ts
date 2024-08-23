"use server";

import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { songSetGet } from "./songSetGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { SlimSong } from "@/features/sections/song/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songLoad = async ({
	songId,
	songSetId,
}: {
	songId: string;
	songSetId?: string | null;
}) => {
	try {
		const sessionExtendResult = await sessionExtend();
		if (sessionExtendResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = sessionExtendResult.sessionCookieData;

		const { uid } = sessionCookieData;

		const songResult = await songGet(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song not found");
		}
		const song = songResult.song;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Failed to get user doc");
		}
		const { userDoc } = userDocResult;

		const oldSlimSong = userDoc.songSets[songId];
		const newSlimSong: SlimSong = {
			songName: song.songName,
			sharer: uid,
		};
		const slimSongsAreEqual =
			JSON.stringify(oldSlimSong) === JSON.stringify(newSlimSong);

		if (!slimSongsAreEqual || userDoc.songId !== songId) {
			const songs = userDoc.songs;
			songs[songId] = newSlimSong;
			await db.collection(collection.USERS).doc(uid).update({
				songId,
				songs,
			});
		}

		if (songSetId) {
			const songSetResult = await songSetGet(songSetId);
			if (songSetResult.actionResultType === actionResultType.ERROR) {
				return actionErrorMessageGet("Song set not found");
			}
			const { songSet } = songSetResult;
			const songSetSongs = songSet.songSetSongs;
			const songKey = songSetSongs[songId].songKey;

			return {
				actionResultType: actionResultType.SUCCESS,
				song,
				songKey,
			};
		}

		return {
			actionResultType: actionResultType.SUCCESS,
			song,
			songKey: null,
		};
	} catch (error) {
		console.error(error);
		return actionErrorMessageGet("An error occurred");
	}
};
