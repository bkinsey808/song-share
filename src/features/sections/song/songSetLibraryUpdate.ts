import { doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { Get, Set } from "@/features/app-store/types";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import { getKeys } from "@/features/global/getKeys";
import { SongSetSchema } from "@/features/sections/song-set/schemas";

export const songSetLibraryUpdate = (get: Get, set: Set) => () => {
	const {
		songSetIds,
		songSetUnsubscribeFns,
		songSetLibrary,
		songSetForm,
		songSetId,
	} = get();
	const songSetSubscriptionsSongIds = getKeys(songSetUnsubscribeFns);
	const songSetIdsToUnsubscribe = songSetSubscriptionsSongIds.filter(
		(unsubscribeSongSetId) => !songSetIds.includes(unsubscribeSongSetId),
	);
	songSetIdsToUnsubscribe.forEach((unsubscribeSongSetId) => {
		songSetUnsubscribeFns[unsubscribeSongSetId]();
		delete songSetUnsubscribeFns[unsubscribeSongSetId];
		delete songSetLibrary[unsubscribeSongSetId];
	});

	const songSetIdsToSubscribe = songSetIds.filter(
		(subscribeSongSetId) =>
			!songSetSubscriptionsSongIds.includes(subscribeSongSetId),
	);

	songSetIdsToSubscribe.forEach((subscribeSongSetId) => {
		const unsubscribeFn = onSnapshot(
			doc(db, collection.SONG_SETS, subscribeSongSetId),
			(songSetSnapshot) => {
				if (!songSetSnapshot.exists) {
					console.warn(`Song set ${subscribeSongSetId} does not exist`);
					return;
				}
				const songSetData = songSetSnapshot.data();
				if (!songSetData) {
					console.warn(`No data found for song set ${subscribeSongSetId}`);
					return;
				}
				const songSetParseResult = safeParse(SongSetSchema, songSetData);
				if (!songSetParseResult.success) {
					console.warn(`Invalid data for song set ${subscribeSongSetId}`);
					return;
				}
				const songSet = songSetParseResult.output;
				songSetLibrary[subscribeSongSetId] = songSet;
				if (songSetId === subscribeSongSetId) {
					set({ songSet });
					songSetForm?.reset?.(songSet);
				}
			},
		);
		songSetUnsubscribeFns[subscribeSongSetId] = unsubscribeFn;
	});

	set({ songSetLibrary, songSetUnsubscribeFns });
};
