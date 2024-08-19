"use server";

import { doc, updateDoc } from "firebase/firestore";

import { sessionExtend } from "./sessionExtend";
import { songSetGet } from "./songSetGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { dbServer } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { SlimSongSet } from "@/features/sections/song-set/types";

export const songSetLoad = async (songSetId: string) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const sessionCookieData = extendSessionResult.sessionCookieData;

		const { username } = sessionCookieData;
		if (!username) {
			return actionErrorMessageGet("Username not found");
		}

		const songSetResult = await songSetGet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song set not found");
		}
		const existingSongSet = songSetResult.songSet;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Failed to get user doc");
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
			await updateDoc(doc(dbServer, "users", username), {
				songSetId,
				songSets,
			});
		}

		return {
			actionResultType: actionResultType.SUCCESS,
			songSet: existingSongSet,
		};
	} catch (error) {
		console.error(error);
		return actionErrorMessageGet("An error occurred");
	}
};
