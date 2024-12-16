import { Firestore, doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { keyMap } from "../song/consts";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { collectionNameGet } from "@/features/firebase/collectionNameGet";
import { collection } from "@/features/firebase/consts";
import { useFirestoreClient } from "@/features/firebase/useFirebaseClient";
import { getKeys } from "@/features/global/getKeys";
import { SongSchema } from "@/features/sections/song/schemas";

export const songLibrarySubscribe =
	(get: AppSliceGet, set: AppSliceSet) =>
	({
		db,
		clearDb,
	}: {
		db: ReturnType<ReturnType<typeof useFirestoreClient>["getDb"]>;
		clearDb: ReturnType<typeof useFirestoreClient>["clearDb"];
	}) => {
		const { songIds, songUnsubscribeFns, songLibrary } = get();
		const deletedSongIds = [] as string[];
		const songSubscriptionsSongIds = getKeys(songUnsubscribeFns);
		const songIdsToUnsubscribe = songSubscriptionsSongIds.filter(
			(unsubscribeSongId) => !songIds.includes(unsubscribeSongId),
		);
		songIdsToUnsubscribe.forEach((unsubscribeSongId) => {
			songUnsubscribeFns[unsubscribeSongId]();
			delete songUnsubscribeFns[unsubscribeSongId];
			delete songLibrary[unsubscribeSongId];

			const { songId, songForm } = get();
			if (songId === unsubscribeSongId) {
				set({ songId: null });
				songForm?.reset?.({});
			}
		});

		const songIdsToSubscribe = songIds.filter(
			(subscribeSongId) => !songSubscriptionsSongIds.includes(subscribeSongId),
		);

		if (!db) {
			return;
		}

		try {
			songIdsToSubscribe.forEach((subscribeSongId) => {
				const unsubscribeFn = onSnapshot(
					doc(db, collectionNameGet(collection.SONGS), subscribeSongId),
					(songSnapshot) => {
						if (songSnapshot.metadata.fromCache) {
							clearDb();
							return;
						}

						if (!songSnapshot.exists) {
							console.warn(`Song ${subscribeSongId} does not exist`);
							return;
						}
						const songData = songSnapshot.data();
						if (!songData) {
							console.warn(`No data found for song ${subscribeSongId}`);
							return;
						}
						const songParseResult = safeParse(SongSchema, songData);
						if (!songParseResult.success) {
							console.warn(`Invalid data for song ${subscribeSongId}`);
							return;
						}
						const song = songParseResult.output;

						const { songId, songForm, songLibrarySongSet } = get();

						songLibrarySongSet({
							songId: subscribeSongId,
							song,
						});

						if (songId === subscribeSongId) {
							songForm?.reset?.({
								...song,
								songKeyString: keyMap.get(song.songKey),
							});
						}
					},
					(error) => console.error(error),
				);
				songUnsubscribeFns[subscribeSongId] = unsubscribeFn;
			});

			set({ songLibrary, songUnsubscribeFns });
		} catch (e) {
			console.error(e);
		}
	};
