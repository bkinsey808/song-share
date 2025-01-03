"use server";

import { sessionExtend } from "./sessionExtend";
import { userPublicDocGet } from "./userPublicDocGet";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { SongRequests } from "@/features/sections/song-requests/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

type SongRequestRemove = ({
	songId,
	fuid,
	requestUserId,
}: {
	songId: string;
	fuid: string | null;
	requestUserId?: string;
}) => Promise<
	| {
			actionResultType: "SUCCESS";
			songRequests: SongRequests;
	  }
	| {
			actionResultType: "ERROR";
			message: string;
	  }
>;

// eslint-disable-next-line complexity
export const songRequestRemove: SongRequestRemove = async ({
	songId,
	fuid,
	requestUserId,
}) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		const requestUserIdWithDefault = requestUserId ?? uid;

		const userPublicGetResult = await userPublicDocGet(fuid ?? uid);
		if (userPublicGetResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Public user not found");
		}
		const { userPublicDoc } = userPublicGetResult;

		const songRequests = userPublicDoc.songRequests ?? {};
		const songRequestUserIds = songRequests[songId] ?? [];
		if (!songRequestUserIds.includes(requestUserIdWithDefault)) {
			return actionErrorMessageGet("Song not already requested");
		}
		const newSongRequestUserIds = songRequestUserIds.filter(
			(id) => id !== requestUserIdWithDefault,
		);
		if (newSongRequestUserIds.length === 0) {
			delete songRequests[songId];
		} else {
			songRequests[songId] = newSongRequestUserIds;
		}
		await db
			.collection(collectionNameGet(collection.USERS_PUBLIC))
			.doc(fuid ?? uid)
			.update({ songRequests });

		return {
			actionResultType: ActionResultType.SUCCESS,
			songRequests,
		};
	} catch (error) {
		return actionErrorMessageGet("Error removing song request");
	}
};
