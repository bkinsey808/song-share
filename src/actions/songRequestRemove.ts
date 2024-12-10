"use server";

import { safeParse } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { userPublicDocGet } from "./userPublicDocGet";
import { actionResultType } from "@/features/app-store/consts";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songRequestRemove = async ({
	songId,
	fuid,
	requestUserId,
}: {
	songId: string;
	fuid: string | null;
	requestUserId?: string;
}) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		requestUserId = requestUserId ?? uid;

		const userPublicGetResult = await userPublicDocGet(fuid ?? uid);
		if (userPublicGetResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Public user not found");
		}
		const { userPublicDoc } = userPublicGetResult;

		const songRequests = userPublicDoc.songRequests ?? {};
		const songRequestUserIds = songRequests[songId] ?? [];
		if (!songRequestUserIds.includes(requestUserId)) {
			return actionErrorMessageGet("Song not already requested");
		}
		const newSongRequestUserIds = songRequestUserIds.filter(
			(id) => id !== requestUserId,
		);
		if (newSongRequestUserIds.length === 0) {
			delete songRequests[songId];
		} else {
			songRequests[songId] = newSongRequestUserIds;
		}
		await db
			.collection(collection.USERS_PUBLIC)
			.doc(fuid ?? uid)
			.update({ songRequests });

		return {
			actionResultType: actionResultType.SUCCESS,
			songRequests,
		};
	} catch (error) {
		return actionErrorMessageGet("Error removing song request");
	}
};
