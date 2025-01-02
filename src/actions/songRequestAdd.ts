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

type SongRequestAdd = ({
	songId,
	fuid,
}: {
	songId: string;
	fuid: string | null;
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

export const songRequestAdd: SongRequestAdd = async ({ songId, fuid }) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		const userPublicGetResult = await userPublicDocGet(fuid ?? uid);
		if (userPublicGetResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Public user not found");
		}
		const { userPublicDoc } = userPublicGetResult;

		const songRequests = userPublicDoc.songRequests ?? {};
		const songRequestUserIds = songRequests[songId] ?? [];

		if (songRequestUserIds.includes(uid)) {
			return actionErrorMessageGet("Song already requested");
		}

		songRequestUserIds.push(uid);
		songRequests[songId] = songRequestUserIds;
		await db
			.collection(collectionNameGet(collection.USERS_PUBLIC))
			.doc(fuid ?? uid)
			.update({ songRequests });

		return {
			actionResultType: ActionResultType.SUCCESS,
			songRequests,
		};
	} catch (error) {
		return actionErrorMessageGet("Error adding song request");
	}
};
