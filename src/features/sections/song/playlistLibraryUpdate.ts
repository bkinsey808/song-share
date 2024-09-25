import { doc, onSnapshot } from "firebase/firestore";
import { safeParse } from "valibot";

import { Get, Set } from "@/features/app-store/types";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import { getKeys } from "@/features/global/getKeys";
import { PlaylistSchema } from "@/features/sections/playlist/schemas";

export const playlistLibraryUpdate = (get: Get, set: Set) => () => {
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
			set({ playlistId: null, playlist: null });
		}
	});

	const playlistIdsToSubscribe = playlistIds.filter(
		(subscribePlaylistId) =>
			!playlistSubscriptionsSongIds.includes(subscribePlaylistId),
	);

	playlistIdsToSubscribe.forEach((subscribePlaylistId) => {
		const unsubscribeFn = onSnapshot(
			doc(db, collection.SONG_SETS, subscribePlaylistId),
			(playlistSnapshot) => {
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
				const { playlistId, playlistForm } = get();

				if (playlistId === subscribePlaylistId) {
					set({ playlist });
					playlistForm?.reset?.(playlist);
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
