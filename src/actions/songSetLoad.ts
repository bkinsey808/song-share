"use server";

import { doc, updateDoc } from "firebase/firestore";

import { extendSession } from "./extendSession";
import { getSongSet } from "./getSongSet";
import { getUserDoc } from "./getUserDoc";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebase";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";
import { SlimSongSet } from "@/features/sections/song-set/types";

export const songSetLoad = async (songSetId: string) => {
	try {
		const extendSessionResult = await extendSession();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}

		const sessionCookieData = extendSessionResult.sessionCookieData;

		const { username } = sessionCookieData;
		if (!username) {
			return getActionErrorMessage("Username not found");
		}

		const songSetResult = await getSongSet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Song set not found");
		}
		const existingSongSet = songSetResult.songSet;

		const userDocResult = await getUserDoc();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Failed to get user doc");
		}
		const userDoc = userDocResult.userDoc;

		const oldSlimSongSet = userDoc.songSets[songSetId];

		const newSlimSongSet: SlimSongSet = {
			songSetName: existingSongSet.songSetName,
			sharer: username,
		};

		const slimSongsAreEqual =
			JSON.stringify(oldSlimSongSet) === JSON.stringify(newSlimSongSet);

		if (!slimSongsAreEqual) {
			const songSets = userDoc.songSets;
			songSets[songSetId] = newSlimSongSet;
			await updateDoc(doc(db, "users", username), { songSetId, songSets });
		}

		return {
			actionResultType: actionResultType.SUCCESS,
			songSet: existingSongSet,
		};
	} catch (error) {
		console.error(error);
		return getActionErrorMessage("An error occurred");
	}
};
