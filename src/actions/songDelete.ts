"use server";

import { sessionExtend } from "./sessionExtend";
import { songGet } from "./songGet";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songDelete = async (songId: string) => {
	try {
		if (!songId) {
			return actionErrorMessageGet("Song ID is required");
		}

		const sessionExtendResult = await sessionExtend();
		if (sessionExtendResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { uid } = sessionExtendResult.sessionCookieData;

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("User not found");
		}
		const { userDoc } = userDocResult;

		const userDocSongs = userDoc.songs;

		// first, confirm user owns the song
		if (!userDocSongs[songId]) {
			return actionErrorMessageGet("User does not own this song");
		}

		const songResult = await songGet(songId);
		if (songResult.actionResultType === actionResultType.ERROR) {
			return songResult;
		}
		const { song } = songResult;

		if (song.sharer !== uid) {
			return actionErrorMessageGet("User does not own this song");
		}

		// delete the song form the songs collection
		await db.collection(collection.SONGS).doc(songId).delete();

		delete userDocSongs[songId];

		// update user doc songs with the deleted song removed
		await db.collection(collection.USERS).doc(uid).update({
			songs: userDocSongs,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
		};
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Failed to delete song");
	}
};
