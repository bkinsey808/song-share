"use server";

import { sessionExtend } from "./sessionExtend";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { SongRequests } from "@/features/sections/song-requests/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

type SongRequestsRemoveAll = (songId: string) => Promise<
	| {
			actionResultType: "SUCCESS";
			songRequests: SongRequests;
	  }
	| {
			actionResultType: "ERROR";
			message: string;
	  }
>;

export const songRequestsRemoveAll: SongRequestsRemoveAll = async (songId) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { sessionCookieData, userPublicDoc } = extendSessionResult;
		const { uid } = sessionCookieData;

		const songRequests = userPublicDoc.songRequests ?? {};
		delete songRequests[songId];
		await db
			.collection(collectionNameGet(collection.USERS_PUBLIC))
			.doc(uid)
			.update({ songRequests });

		return {
			actionResultType: ActionResultType.SUCCESS,
			songRequests,
		};
	} catch (error) {
		return actionErrorMessageGet("Error removing all song requests for song");
	}
};
