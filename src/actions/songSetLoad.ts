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

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Failed to get user doc");
		}
		const { userDoc } = userDocResult;

		const newSongSetIds = userDoc.songSetIds
			? Array.from(new Set([...userDoc.songSetIds, songSetId]))
			: [songSetId];

		await db.collection(collection.USERS).doc(uid).update({
			songSetIds: newSongSetIds,
			songSetId,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			songSetIds: newSongSetIds,
		};
	} catch (error) {
		console.error(error);
		return actionErrorMessageGet("An error occurred");
	}
};
