"use server";

import { playlistGet } from "./playlistGet";
import { sessionExtend } from "./sessionExtend";
import { userPublicDocGet } from "./userPublicDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const playlistActiveSet = async (playlistId: string | null) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;
		const { uid } = sessionCookieData;

		const userPublicGetResult = await userPublicDocGet();
		if (userPublicGetResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Public user not found");
		}
		const { userPublicDoc } = userPublicGetResult;
		const { songActiveId } = userPublicDoc;

		if (playlistId) {
			const playlistResult = await playlistGet(playlistId);
			if (playlistResult.actionResultType === actionResultType.ERROR) {
				return actionErrorMessageGet("Song set not found");
			}
			const playlist = playlistResult.playlist;
			const { songIds } = playlist;

			if (
				songIds.length > 0 &&
				(!songActiveId || (songActiveId && !songIds.includes(songActiveId)))
			) {
				await db
					.collection(collection.USERS_PUBLIC)
					.doc(uid)
					.update({ playlistActiveId: playlistId, songActiveId: songIds[0] });
			} else {
				await db
					.collection(collection.USERS_PUBLIC)
					.doc(uid)
					.update({ playlistActiveId: playlistId });
			}

			return {
				actionResultType: actionResultType.SUCCESS,
				songActiveId,
			};
		}

		await db
			.collection(collection.USERS_PUBLIC)
			.doc(uid)
			.update({ playlistActiveId: playlistId });

		return { actionResultType: actionResultType.SUCCESS, songActiveId: null };
	} catch (error) {
		return actionErrorMessageGet("Error setting active playlist");
	}
};