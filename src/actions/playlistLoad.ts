"use server";

import { playlistGet } from "./playlistGet";
import { sessionExtend } from "./sessionExtend";
import { userDocGet } from "./userDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const playlistLoad = async (playlistId: string) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;
		const { uid } = sessionCookieData;

		const playlistResult = await playlistGet(playlistId);
		if (playlistResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Playlist not found");
		}

		const userDocResult = await userDocGet();
		if (userDocResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Failed to get user doc");
		}
		const { userDoc } = userDocResult;

		const newPlaylistIds = userDoc.playlistIds
			? Array.from(new Set([...userDoc.playlistIds, playlistId]))
			: [playlistId];

		await db.collection(collection.USERS).doc(uid).update({
			playlistIds: newPlaylistIds,
			playlistId,
		});

		return {
			actionResultType: actionResultType.SUCCESS,
			playlistIds: newPlaylistIds,
		};
	} catch (error) {
		console.error(error);
		return actionErrorMessageGet("An error occurred");
	}
};
