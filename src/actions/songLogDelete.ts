"use server";

import { sessionExtend } from "./sessionExtend";
import { songLogGet } from "./songLogGet";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

type SongLogDelete = ({
	songId,
	logId,
}: {
	songId: string;
	logId: string;
}) => Promise<
	| {
			actionResultType: "SUCCESS";
	  }
	| {
			actionResultType: "ERROR";
			message: string;
	  }
>;

export const songLogDelete: SongLogDelete = async ({ songId, logId }) => {
	try {
		if (!logId) {
			return actionErrorMessageGet("Log ID is required");
		}

		const sessionExtendResult = await sessionExtend();
		if (sessionExtendResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}
		const { uid } = sessionExtendResult.sessionCookieData;

		const songLogResult = await songLogGet({
			songId,
			uid,
		});
		if (songLogResult.actionResultType === ActionResultType.ERROR) {
			return actionErrorMessageGet("Song log not found");
		}
		const { songLog } = songLogResult;
		const { logIds = [], logs = {} } = songLog;

		const newLogIds = logIds.filter((innerLogId) => innerLogId !== logId);
		const newLogs = { ...logs };
		delete newLogs[logId];

		if (logIds.length === 0) {
			await db
				.collection(collectionNameGet(collection.SONG_LOGS))
				.doc(`${uid}_${songId}`)
				.delete();
		} else {
			await db
				.collection(collectionNameGet(collection.SONG_LOGS))
				.doc(`${uid}_${songId}`)
				.update({
					songId,
					uid,
					logIds: newLogIds,
					logs: newLogs,
				});
		}

		return {
			actionResultType: ActionResultType.SUCCESS,
		};
	} catch (error) {
		console.error({ error });
		return actionErrorMessageGet("Failed to delete song");
	}
};
