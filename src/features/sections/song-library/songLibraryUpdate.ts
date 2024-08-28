import { doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { Get, Set } from "@/features/app-store/types";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import { getKeys } from "@/features/global/getKeys";
import { SongSchema } from "@/features/sections/song/schemas";

export const songLibraryUpdate = (get: Get, set: Set) => () => {
	const { songIds, songUnsubscribeFns, songLibrary, songForm, songId } = get();
	const songSubscriptionsSongIds = getKeys(songUnsubscribeFns);
	const songIdsToUnsubscribe = songSubscriptionsSongIds.filter(
		(unsubscribeSongId) => !songIds.includes(unsubscribeSongId),
	);
	songIdsToUnsubscribe.forEach((unsubscribeSongId) => {
		songUnsubscribeFns[unsubscribeSongId]();
		delete songUnsubscribeFns[unsubscribeSongId];
		delete songLibrary[unsubscribeSongId];
	});

	const songIdsToSubscribe = songIds.filter(
		(subscribeSongId) => !songSubscriptionsSongIds.includes(subscribeSongId),
	);

	songIdsToSubscribe.forEach((subscribeSongId) => {
		const unsubscribeFn = onSnapshot(
			doc(db, collection.SONGS, subscribeSongId),
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
				songLibrary[subscribeSongId] = song;
				if (songId === subscribeSongId) {
					set({ song });
					songForm?.reset?.(song);
				}
			},
		);
		songUnsubscribeFns[subscribeSongId] = unsubscribeFn;
	});

	set({ songLibrary, songUnsubscribeFns });
};
