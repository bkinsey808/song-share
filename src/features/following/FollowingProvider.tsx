"use client";

import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { safeParse } from "valibot";

import { PlaylistSchema } from "../sections/playlist/schemas";
import { SongSchema } from "../sections/song/schemas";
import { useAppStore } from "@/features/app-store/useAppStore";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import { UserPublicDocSchema } from "@/features/firebase/schemas";

export const FollowingProvider = ({ children }: { children: ReactNode }) => {
	const params = useParams();
	const fuid = params.fuid;
	const { setFuid, setFollowing, setSong, playlistSet, playlistIdSet } =
		useAppStore();

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
							setSong(song);
							const songForm = useAppStore.getState().songForm;
							songForm?.reset?.(song);
						},
					);
					unsubscribeFns.push(songUnsubscribe);
				}

				if (following.playlistActiveId) {
					const playlistUnsubscribe = onSnapshot(
						doc(db, collection.SONG_SETS, following.playlistActiveId),
						(playlistSnapshot) => {
							if (!playlistSnapshot.exists) {
								console.warn("Song set does not exist");
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
							playlistSet(playlist);
							playlistIdSet(following.playlistActiveId ?? null);
							const playlistForm = useAppStore.getState().playlistForm;
							playlistForm?.reset?.(playlist);
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
	}, [fuid, setFuid, setFollowing, setSong, playlistSet]);

	return <>{children}</>;
};
