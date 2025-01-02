"use server";

import { sessionCookieGet } from "./sessionCookieGet";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";
import { serverParse } from "@/features/global/serverParse";
import { SongLogSchema } from "@/features/sections/song-log/schemas";
import { SongLog } from "@/features/sections/song-log/types";

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

type SongLogGet = ({
	songId,
	uid,
}: {
	songId: string;
	uid?: string;
}) => Promise<
	| {
			actionResultType: "SUCCESS";
			songLog: SongLog;
	  }
	| {
			actionResultType: "ERROR";
			message: string;
	  }
>;

export const songLogGet: SongLogGet = async ({ songId, uid }) => {
	try {
		if (!uid) {
			const cookieResult = await sessionCookieGet();

			if (cookieResult.actionResultType === ActionResultType.ERROR) {
				return actionErrorMessageGet("Session expired");
			}

			const sessionCookieData = cookieResult.sessionCookieData;
			uid = sessionCookieData.uid;
		}

		const songLogSnapshot = await db
			.collection(collectionNameGet(collection.SONG_LOGS))
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

		return { actionResultType: ActionResultType.SUCCESS, songLog };
	} catch (error) {
		return actionErrorMessageGet("Error getting song log");
	}
};
