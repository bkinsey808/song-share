"use server";

import { sessionExtend } from "./sessionExtend";
import { songSetGet } from "./songSetGet";
import { userPublicDocGet } from "./userPublicDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songSetActiveSet = async (songSetId: string | null) => {
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

		if (songSetId) {
			const songSetResult = await songSetGet(songSetId);
			if (songSetResult.actionResultType === actionResultType.ERROR) {
				return actionErrorMessageGet("Song set not found");
			}
			const songSet = songSetResult.songSet;
			const { songIds } = songSet;

			if (
				songIds.length > 0 &&
				(!songActiveId || (songActiveId && !songIds.includes(songActiveId)))
			) {
				await db
					.collection(collection.USERS_PUBLIC)
					.doc(uid)
					.update({ songSetActiveId: songSetId, songActiveId: songIds[0] });
			} else {
				await db
					.collection(collection.USERS_PUBLIC)
					.doc(uid)
					.update({ songSetActiveId: songSetId });
			}

			return {
				actionResultType: actionResultType.SUCCESS,
				songActiveId,
			};
		}

		await db
			.collection(collection.USERS_PUBLIC)
			.doc(uid)
			.update({ songSetActiveId: songSetId });

		return { actionResultType: actionResultType.SUCCESS, songActiveId: null };
	} catch (error) {
		return actionErrorMessageGet("Error setting active song set");
	}
};
