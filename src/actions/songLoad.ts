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

export const songLoad = async ({ songId }: { songId: string }) => {
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

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Failed to get user doc");
		}
		const { userDoc } = userDocResult;

		const newSongIds = userDoc.songIds
			? Array.from(new Set([...userDoc.songIds, songId]))
			: [songId];

		await db.collection(collection.USERS).doc(uid).update({
			songIds: newSongIds,
			songId,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			songIds: newSongIds,
		};
	} catch (error) {
		console.error(error);
		return actionErrorMessageGet("An error occurred");
	}
};
