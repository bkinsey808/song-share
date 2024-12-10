"use server";

import { sessionExtend } from "./sessionExtend";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songRequestsRemoveAll = async (songId: string) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { sessionCookieData, userPublicDoc } = extendSessionResult;
		const { uid } = sessionCookieData;

		const songRequests = userPublicDoc.songRequests ?? {};
		delete songRequests[songId];
		await db
			.collection(collection.USERS_PUBLIC)
			.doc(uid)
			.update({ songRequests });

		return {
			actionResultType: actionResultType.SUCCESS,
			songRequests,
		};
	} catch (error) {
		return actionErrorMessageGet("Error removing all song requests for song");
	}
};
