"use server";

import { sessionExtend } from "./sessionExtend";
import { songSetGet } from "./songSetGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { SlimSongSet } from "@/features/sections/song-set/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songSetLoad = async (songSetId: string) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const sessionCookieData = extendSessionResult.sessionCookieData;

		const { uid } = sessionCookieData;

		const songSetResult = await songSetGet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Song set not found");
		}
		const existingSongSet = songSetResult.songSet;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Failed to get user doc");
		}
		const { userDoc } = userDocResult;

		const oldSlimSongSet = userDoc.songSets[songSetId];

		const newSlimSongSet: SlimSongSet = {
			songSetName: existingSongSet.songSetName,
			sharer: uid,
		};

		const slimSongsAreEqual =
			JSON.stringify(oldSlimSongSet) === JSON.stringify(newSlimSongSet);

		if (!slimSongsAreEqual || userDoc.songSetId !== songSetId) {
			const songSets = userDoc.songSets;
			songSets[songSetId] = newSlimSongSet;
			await db.collection("users").doc(uid).update({
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
