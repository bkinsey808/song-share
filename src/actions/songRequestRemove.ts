"use server";

import { safeParse } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { actionResultType } from "@/features/app-store/consts";
import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { UserPublicDocSchema } from "@/features/firebase/schemas";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export const songRequestRemove = async ({
	songId,
	fuid,
}: {
	songId: string;
	fuid: string | null;
}) => {
	try {
		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const sessionCookieData = extendSessionResult.sessionCookieData;
		const { uid } = sessionCookieData;

		const userPublicGetResult = await db
			.collection(Collection.USERS_PUBLIC)
			.doc(fuid ?? uid)
			.get();
		if (!userPublicGetResult.exists) {
			return actionErrorMessageGet(`Public user ${fuid} not found`);
		}

		const userPublicDocData = userPublicGetResult.data();
		if (!userPublicDocData) {
			return actionErrorMessageGet("Public user not found");
		}

		const userPublicDocDataParseResult = safeParse(
			UserPublicDocSchema,
			userPublicDocData,
		);
		if (!userPublicDocDataParseResult.success) {
			return actionErrorMessageGet("Public user data invalid");
		}
		const userPublicDoc = userPublicDocDataParseResult.output;
		const songRequests = userPublicDoc.songRequests ?? {};
		const songRequestUserIds = songRequests[songId] ?? [];
		if (!songRequestUserIds.includes(uid)) {
			return actionErrorMessageGet("Song not already requested");
		}
		const newSongRequestUserIds = songRequestUserIds.filter((id) => id !== uid);
		if (newSongRequestUserIds.length === 0) {
			delete songRequests[songId];
		} else {
			songRequests[songId] = newSongRequestUserIds;
		}
		await db
			.collection(Collection.USERS_PUBLIC)
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
