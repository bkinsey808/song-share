"use server";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";
import { SongLogSchema } from "@/features/sections/song-log/schemas";

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export const songLogGet = async ({
	songId,
	uid,
}: {
	songId: string;
	uid?: string;
}) => {
	try {
		if (!uid) {
			const cookieResult = await sessionCookieGet();

			if (cookieResult.actionResultType === actionResultType.ERROR) {
				return actionErrorMessageGet("Session expired");
			}

			const sessionCookieData = cookieResult.sessionCookieData;
			uid = sessionCookieData.uid;
		}

		const songLogSnapshot = await db
			.collection(Collection.SONG_LOGS)
			.doc(`${uid}_${songId}`)
			.get();
		if (!songLogSnapshot.exists) {
			return actionErrorMessageGet("Song log not found");
		}
		const songLogData = songLogSnapshot.data();

		if (!songLogData) {
			return actionErrorMessageGet("Song log data not found");
		}

		const songLogResult = serverParse(SongLogSchema, songLogData);
		if (!songLogResult.success) {
			return actionErrorMessageGet("Song Log data invalid");
		}

		const songLog = songLogResult.output;

		return { actionResultType: actionResultType.SUCCESS, songLog };
	} catch (error) {
		return actionErrorMessageGet("Error getting song log");
	}
};
