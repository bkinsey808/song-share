"use server";

import { sessionExtend } from "./sessionExtend";
import { songSetGet } from "./songSetGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songSetDelete = async (songSetId: string) => {
	try {
		if (!songSetId) {
			return actionErrorMessageGet("Song set id is required");
		}

		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;

		const { username, uid } = sessionCookieData;

		if (!username) {
			return actionErrorMessageGet("Username not found");
		}

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return userDocResult;
		}
		const { userDoc } = userDocResult;

		const userDocSongSets = userDoc.songSets;

		// first, confirm user owns the song
		if (!userDocSongSets[songSetId]) {
			return actionErrorMessageGet("User does not own this song set");
		}

		const songSetResult = await songSetGet(songSetId);
		if (songSetResult.actionResultType === actionResultType.ERROR) {
			return songSetResult;
		}
		const { songSet } = songSetResult;

		if (songSet.sharer !== uid) {
			return actionErrorMessageGet("User does not own this song");
		}

		// delete the song set from the song sets collection
		await db.collection(collection.SONG_SETS).doc(songSetId).delete();

		delete userDocSongSets[songSetId];

		// update user doc songs with the deleted song removed
		await db.collection(collection.USERS).doc(uid).update({
			songSets: userDocSongSets,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
		};
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Failed to delete song set");
	}
};
