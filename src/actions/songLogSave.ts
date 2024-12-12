"use server";

import { flatten } from "valibot";

import { sessionExtend } from "./sessionExtend";
import { songLogGet } from "./songLogGet";
import { actionResultType } from "@/features/app-store/consts";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseServer";
import { serverParse } from "@/features/global/serverParse";
import { SongLogFormSchema } from "@/features/sections/song-log/schemas";
import { SongLogForm } from "@/features/sections/song-log/types";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const getFormError = (formError: string) => {
	console.error(formError);
	return {
		actionResultType: actionResultType.ERROR,
		formError,
		fieldErrors: undefined,
	};
};

// eslint-disable-next-line @typescript-eslint/require-await
export const songLogSave = async (logFormValues: SongLogForm) => {
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
				actionResultType: actionResultType.ERROR,
				fieldErrors: flatten<typeof SongLogFormSchema>(
					logFormParseResult.issues,
				).nested,
			};
		}

		const extendSessionResult = await sessionExtend();
		if (extendSessionResult.actionResultType === actionResultType.ERROR) {
			return getFormError("Session expired");
		}
		const { sessionCookieData } = extendSessionResult;
		const { uid } = sessionCookieData;

		const songLogResult = await songLogGet({
			songId: logFormValues.songId,
			uid,
		});
		if (songLogResult.actionResultType === actionResultType.ERROR) {
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
			actionResultType: actionResultType.SUCCESS,
			logId: logFormValues.logId,
		};
	} catch (error) {
		console.error({ error });
		return getFormError("Failed to save song log");
	}
};
