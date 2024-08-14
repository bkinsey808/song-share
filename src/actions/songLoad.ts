"use server";

import { doc, updateDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { getSong } from "./getSong";
import { getSongSet } from "./getSongSet";
import { getUserDoc } from "./getUserDoc";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { SlimSong } from "@/features/sections/song/types";

export const songLoad = async ({
	songId,
	songSetId,
}: {
	songId: string;
	songSetId?: string | null;
}) => {
	try {
		const extendSessionResult = await extendSession();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;

		const username = sessionCookieData.username;
		if (!username) {
			return getActionErrorMessage("Username not found");
		}

		const songResult = await getSong(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Song not found");
		}
		const song = songResult.song;

		const userDocResult = await getUserDoc();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Failed to get user doc");
		}
		const userDoc = userDocResult.userDoc;

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
			await updateDoc(doc(db, "users", username), { songId, songs });
		}

		if (songSetId) {
			const songSetResult = await getSongSet(songSetId);
			if (songSetResult.actionResultType === actionResultType.ERROR) {
				return getActionErrorMessage("Song set not found");
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
		return getActionErrorMessage("An error occurred");
	}
};
