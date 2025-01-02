"use server";

import { flatten } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { songLogGet } from "./songLogGet";
import { ActionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { getFormError } from "@/features/form/getFormError";
import { serverParse } from "@/features/global/serverParse";
import { SongLogFormSchema } from "@/features/sections/song-log/schemas";
import { SongLogForm } from "@/features/sections/song-log/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line @typescript-eslint/require-await

type SongLogSave = (logFormValues: SongLogForm) => Promise<
	| {
			actionResultType: "SUCCESS";
			logId: string;
	  }
	| {
			actionResultType: "ERROR";
			fieldErrors: ReturnType<typeof flatten>["nested"];
	  }
>;
export const songLogSave: SongLogSave = async (logFormValues) => {
	if (!logFormValues.logId) {
		logFormValues = {
			...logFormValues,
			logId: crypto.randomUUID(),
		};
	}

	try {
		const logFormParseResult = serverParse(SongLogFormSchema, logFormValues);
		if (!logFormParseResult.success) {
			return {
				actionResultType: ActionResultType.ERROR,
				fieldErrors: flatten<typeof SongLogFormSchema>(
					logFormParseResult.issues,
				).nested,
			};
		}

		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === ActionResultType.ERROR) {
			return getFormError("Session expired");
		}
		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		const songLogResult = await songLogGet({
			songId: logFormValues.songId,
			uid,
		});
		if (songLogResult.actionResultType === ActionResultType.ERROR) {
			await db
				.collection(collectionNameGet(collection.SONG_LOGS))
				.doc(`${uid}_${logFormValues.songId}`)
				.set({
					songId: logFormValues.songId,
					uid,
					logIds: [logFormValues.logId],
					logs: {
						[logFormValues.logId]: {
							notes: logFormValues.notes,
							date: logFormValues.date,
						},
					},
				});
		} else {
			const { songLog } = songLogResult;
			const { logs, logIds } = songLog;
			const newLogIds = logIds?.find((logId) => logId === logFormValues.logId)
				? logIds
				: [...(logIds ?? []), logFormValues.logId];
			const newLogs = {
				...logs,
				[logFormValues.logId]: logFormValues,
			};

			await db
				.collection(collectionNameGet(collection.SONG_LOGS))
				.doc(`${uid}_${logFormValues.songId}`)
				.update({
					logIds: newLogIds,
					logs: newLogs,
				});
		}

		return {
			actionResultType: ActionResultType.SUCCESS,
			logId: logFormValues.logId,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save song log");
	}
};
