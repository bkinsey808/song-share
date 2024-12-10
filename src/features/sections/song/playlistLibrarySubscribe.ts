import { Firestore, doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { collection } from "@/features/firebase/consts";
import { useFirestoreClient } from "@/features/firebase/useFirebaseClient";
import { getKeys } from "@/features/global/getKeys";
import { PlaylistSchema } from "@/features/sections/playlist/schemas";

export const playlistLibrarySubscribe =
	(get: AppSliceGet, set: AppSliceSet) =>
	({
		db,
		clearDb,
	}: {
		db: ReturnType<ReturnType<typeof useFirestoreClient>["getDb"]>;
		clearDb: ReturnType<typeof useFirestoreClient>["clearDb"];
	}) => {
		const { playlistIds, playlistUnsubscribeFns, playlistLibrary } = get();
		const playlistSubscriptionsSongIds = getKeys(playlistUnsubscribeFns);

		const playlistIdsToUnsubscribe = playlistSubscriptionsSongIds.filter(
			(unsubscribePlaylistId) => !playlistIds.includes(unsubscribePlaylistId),
		);

		playlistIdsToUnsubscribe.forEach((unsubscribePlaylistId) => {
			playlistUnsubscribeFns[unsubscribePlaylistId]();
			delete playlistUnsubscribeFns[unsubscribePlaylistId];
			delete playlistLibrary[unsubscribePlaylistId];

			const { playlistId } = get();
			if (playlistId === unsubscribePlaylistId) {
				set({ playlistId: null });
			}
		});

		const playlistIdsToSubscribe = playlistIds.filter(
			(subscribePlaylistId) =>
				!playlistSubscriptionsSongIds.includes(subscribePlaylistId),
		);

		if (!db) {
			return;
		}

		playlistIdsToSubscribe.forEach((subscribePlaylistId) => {
			const unsubscribeFn = onSnapshot(
				doc(db, collection.PLAYLISTS, subscribePlaylistId),
				(playlistSnapshot) => {
					if (playlistSnapshot.metadata.fromCache) {
						clearDb();
						return;
					}

					if (!playlistSnapshot.exists) {
						console.warn(`Playlist ${subscribePlaylistId} does not exist`);
						return;
					}
					const playlistData = playlistSnapshot.data();
					if (!playlistData) {
						console.warn(`No data found for playlist ${subscribePlaylistId}`);
						return;
					}
					const playlistParseResult = safeParse(PlaylistSchema, playlistData);
					if (!playlistParseResult.success) {
						console.warn(`Invalid data for playlist ${subscribePlaylistId}`);
						return;
					}
					const playlist = playlistParseResult.output;
					playlistLibrary[subscribePlaylistId] = playlist;
					const { playlistId, playlistForm, playlistGridForm } = get();

					if (playlistId === subscribePlaylistId) {
						playlistForm?.reset?.(playlist);
						playlistGridForm?.reset?.(playlist);
					}
				},
				(error) => {
					console.error("Error getting playlist:", error);
				},
			);
			playlistUnsubscribeFns[subscribePlaylistId] = unsubscribeFn;
		});

		set({ playlistLibrary, playlistUnsubscribeFns });
	};
