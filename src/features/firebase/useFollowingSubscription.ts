"use client";

import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { safeParse } from "valibot";

import { collectionNameGet } from "./collectionNameGet";
import { useFirestoreClient } from "./useFirebaseClient";
import { useAppStore } from "@/features/app-store/useAppStore";
import { collection } from "@/features/firebase/consts";
import { UserPublicDocSchema } from "@/features/firebase/schemas";
import { getKeys } from "@/features/global/getKeys";
import { sectionId } from "@/features/sections/consts";
import { PlaylistSchema } from "@/features/sections/playlist/schemas";
import { SongSchema } from "@/features/sections/song/schemas";

export const useFollowingSubscription = (fuid: string | string[]) => {
	const {
		setFuid,
		setFollowing,
		songIdSet,
		songActiveIdSet,
		playlistIdSet,
		songLibraryAddSongIds,
		sectionToggle,
		songActiveId,
		songLibrary,
		playlistLibrary,
		userIdsAdd,
		usersActiveSet,
		playlistActiveIdSet,
		songRequestsSet,
	} = useAppStore();

	const { getDb, initialized, clearDb } = useFirestoreClient();

	useEffect(() => {
		// open the the song section if the song is active
		if (songActiveId) {
			sectionToggle(sectionId.SONG, true);
		}
	}, [songActiveId, sectionToggle]);

	useEffect(() => {
		const unsubscribeFns: Unsubscribe[] = [];

		setFollowing(null);

		if (!fuid || typeof fuid !== "string") {
			setFuid(null);
			console.warn("Invalid fuid");
			return;
		}

		setFuid(fuid);

		const db = getDb();

		if (!db) {
			return;
		}

		const userPublicUnsubscribe = onSnapshot(
			doc(db, collectionNameGet(collection.USERS_PUBLIC), fuid),
			(userPublicSnapshot) => {
				if (userPublicSnapshot.metadata.fromCache) {
					clearDb();
					return;
				}
				if (!userPublicSnapshot.exists) {
					console.warn("users public document does not exist!");
					return;
				}
				const followingData = userPublicSnapshot.data();
				if (!followingData) {
					console.warn("No users public data found");
					return;
				}
				const followingResult = safeParse(UserPublicDocSchema, followingData);
				if (!followingResult.success) {
					console.warn("Invalid data");
					return;
				}
				const following = followingResult.output;
				setFollowing(following);

				if (following.songActiveId) {
					const { songId } = useAppStore.getState();

					if (songId !== following.songActiveId) {
						sectionToggle(sectionId.SONG, true, true);
					}

					const songUnsubscribe = onSnapshot(
						doc(
							db,
							collectionNameGet(collection.SONGS),
							following.songActiveId,
						),
						(songSnapshot) => {
							if (songSnapshot.metadata.fromCache) {
								clearDb();
								return;
							}

							if (!songSnapshot.exists) {
								console.warn("Song does not exist");
								return;
							}
							const songData = songSnapshot.data();
							if (!songData) {
								console.warn("No song data found");
								return;
							}
							const songResult = safeParse(SongSchema, songData);
							if (!songResult.success) {
								console.warn("Invalid song data");
								return;
							}
							const song = songResult.output;
							if (following.songActiveId) {
								songLibrary[following.songActiveId] = song;
							}
							songIdSet(song.deleted ? null : following.songActiveId);

							songActiveIdSet(song.deleted ? null : following.songActiveId);

							if (following.songActiveId && !song.deleted) {
								songLibraryAddSongIds([following.songActiveId]);
							}
						},
					);
					unsubscribeFns.push(songUnsubscribe);
				}

				if (following.playlistActiveId) {
					const { playlistId } = useAppStore.getState();

					if (playlistId !== following.playlistActiveId) {
						sectionToggle(sectionId.PLAYLIST, true);
						playlistActiveIdSet(following.playlistActiveId);
					}

					const playlistUnsubscribe = onSnapshot(
						doc(
							db,
							collectionNameGet(collection.PLAYLISTS),
							following.playlistActiveId,
						),
						(playlistSnapshot) => {
							if (playlistSnapshot.metadata.fromCache) {
								clearDb();
								return;
							}

							if (!playlistSnapshot.exists) {
								console.warn("Playlist does not exist");
								return;
							}
							const playlistData = playlistSnapshot.data();
							if (!playlistData) {
								console.warn("No playlist data found");
								return;
							}
							const playlistResult = safeParse(PlaylistSchema, playlistData);
							if (!playlistResult.success) {
								console.warn("Invalid playlist data");
								return;
							}
							const playlist = playlistResult.output;
							if (following.playlistActiveId) {
								playlistLibrary[following.playlistActiveId] = playlist;
							}

							playlistIdSet(following.playlistActiveId ?? null);
							const songIds = playlist.songs.map(({ songId }) => songId);
							useAppStore.getState().songLibraryAddSongIds(songIds);

							if (following.playlistActiveId) {
								useAppStore
									.getState()
									.playlistLibraryAddPlaylistIds([following.playlistActiveId]);
							}
						},
					);
					unsubscribeFns.push(playlistUnsubscribe);
				}

				if (following.usersActive) {
					const { userIds } = useAppStore.getState();
					const newUserIds = Array.from(
						new Set([...getKeys(following.usersActive), ...userIds, fuid]),
					);
					const newUsersActive = following.usersActive;
					userIdsAdd(newUserIds);
					usersActiveSet(newUsersActive);
				} else {
					userIdsAdd([fuid]);
				}

				if (following.songRequests) {
					songRequestsSet(following.songRequests);
					const songIds = getKeys(following.songRequests);
					songLibraryAddSongIds(songIds);
					const userIds = songIds.reduce((acc, songId) => {
						const newUserIds = following.songRequests?.[songId] ?? [];
						return [...acc, ...newUserIds];
					}, [] as string[]);
					userIdsAdd(userIds);
				}
			},
		);

		unsubscribeFns.push(userPublicUnsubscribe);

		return () => {
			unsubscribeFns.forEach((fn) => fn());
			setFuid(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fuid, setFuid, setFollowing, initialized]);
};
