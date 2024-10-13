"use client";

import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { safeParse } from "valibot";

import { useAppStore } from "@/features/app-store/useAppStore";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import { UserPublicDocSchema } from "@/features/firebase/schemas";
import { sectionId } from "@/features/sections/consts";
import { PlaylistSchema } from "@/features/sections/playlist/schemas";
import { SongSchema } from "@/features/sections/song/schemas";

export const useFollowingSubscription = (fuid: string | string[]) => {
	const {
		setFuid,
		setFollowing,
		songSet,
		songIdSet,
		songActiveIdSet,
		playlistIdSet,
		songForm,
		songLibraryAddSongIds,
		sectionToggle,
		songActiveId,
	} = useAppStore();

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

		const userPublicUnsubscribe = onSnapshot(
			doc(db, collection.USERS_PUBLIC, fuid),
			(userPublicSnapshot) => {
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
						sectionToggle(sectionId.SONG, true);
					}

					const songUnsubscribe = onSnapshot(
						doc(db, collection.SONGS, following.songActiveId),
						(songSnapshot) => {
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

							songSet?.(song);
							songIdSet(following.songActiveId);

							songActiveIdSet(following.songActiveId);
							songForm?.reset?.(song);
							if (following.songActiveId) {
								songLibraryAddSongIds([following.songActiveId]);
							}
						},
					);
					unsubscribeFns.push(songUnsubscribe);
				}

				if (following.playlistActiveId) {
					const playlistUnsubscribe = onSnapshot(
						doc(db, collection.PLAYLISTS, following.playlistActiveId),
						(playlistSnapshot) => {
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
							playlistIdSet(following.playlistActiveId ?? null);
							const playlistForm = useAppStore.getState().playlistForm;
							playlistForm?.reset?.(playlist);
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
			},
		);

		unsubscribeFns.push(userPublicUnsubscribe);

		return () => {
			unsubscribeFns.forEach((fn) => fn());
			setFuid(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fuid, setFuid, setFollowing, songSet]);
};
