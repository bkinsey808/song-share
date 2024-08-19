"use server";

import { updateDoc } from "firebase/firestore";

import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { songSetGet } from "./songSetGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { SlimSong } from "@/features/sections/song/types";

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

		const username = sessionCookieData.username;
		if (!username) {
			return actionErrorMessageGet("Username not found");
		}

		const songResult = await songGet(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song not found");
		}
		const song = songResult.song;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Failed to get user doc");
		}
		const { userDoc, userDocRef } = userDocResult;

		const oldSlimSong = userDoc.songSets[songId];
		const newSlimSong: SlimSong = {
			songName: song.songName,
			sharer: username,
		};
		const slimSongsAreEqual =
			JSON.stringify(oldSlimSong) === JSON.stringify(newSlimSong);

		if (!slimSongsAreEqual) {
			const songs = userDoc.songs;
			songs[songId] = newSlimSong;
			await updateDoc(userDocRef, { songId, songs });
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
