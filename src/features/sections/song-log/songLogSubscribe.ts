import {
	Firestore,
	collection,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import { safeParse } from "valibot";

import { SongLogSchema } from "./schemas";
import { SongLogEntry } from "./types";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { useFirestoreClient } from "@/features/firebase/useFirebaseClient";

export const songLogSubscribe =
	(get: AppSliceGet, set: AppSliceSet) =>
	({
		uid,
		db,
		clearDb,
	}: {
		uid: string;
		db: ReturnType<ReturnType<typeof useFirestoreClient>["getDb"]>;
		clearDb: ReturnType<typeof useFirestoreClient>["clearDb"];
	}) => {
		if (!db) {
			return;
		}
		const songLogsRef = collection(db, "songLogs");
		const q = query(songLogsRef, where("uid", "==", uid));
		const { songLogs } = get();

		const songLogUnsubscribeFn = onSnapshot(q, (querySnapshot) => {
			if (querySnapshot.metadata.fromCache) {
				clearDb();
				return;
			}

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
