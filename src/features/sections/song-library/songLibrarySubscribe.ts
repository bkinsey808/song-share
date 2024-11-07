import { doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { Collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import { getKeys } from "@/features/global/getKeys";
import { SongSchema } from "@/features/sections/song/schemas";

export const songLibrarySubscribe =
	(get: AppSliceGet, set: AppSliceSet) => () => {
		const { songIds, songUnsubscribeFns, songLibrary } = get();
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

		songIdsToSubscribe.forEach((subscribeSongId) => {
			const unsubscribeFn = onSnapshot(
				doc(db, Collection.SONGS, subscribeSongId),
				(songSnapshot) => {
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
						songForm?.reset?.(song);
					}
				},
			);
			songUnsubscribeFns[subscribeSongId] = unsubscribeFn;
		});

		set({ songLibrary, songUnsubscribeFns });
	};
