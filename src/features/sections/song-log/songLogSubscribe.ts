import { collection, onSnapshot, query, where } from "firebase/firestore";
import { safeParse } from "valibot";

import { SongLogSchema } from "./schemas";
import { SongLogEntry } from "./types";
import { Get, Set } from "@/features/app-store/types";
import { db } from "@/features/firebase/firebaseClient";

export const songLogSubscribe = (get: Get, set: Set) => (uid: string) => {
	const songLogsRef = collection(db, "songLogs");
	const q = query(songLogsRef, where("uid", "==", uid));
	const { songLogs } = get();

	const songLogUnsubscribeFn = onSnapshot(q, (querySnapshot) => {
		const newSongLogs = querySnapshot.docs
			.map((doc) => doc.data())
			.map((songLog) => {
				const songLogParseResult = safeParse(SongLogSchema, songLog);
				if (!songLogParseResult.success) {
					console.warn(`Invalid data for song log ${songLog.logId}`, songLog);
					return;
				}
				return songLogParseResult.output;
			})
			.reduce(
				(acc, songLog) => {
					if (!songLog) {
						return acc;
					}
					return {
						...acc,
						[songLog.songId]: songLog.logIds.map((logId) => ({
							logId,
							date: songLog.logs[logId].date,
							notes: songLog.logs[logId].notes,
						})),
					};
				},
				{ ...songLogs } as Record<string, SongLogEntry[]>,
			);
		set({ songLogs: newSongLogs, songLogUnsubscribeFn });
	});
};
