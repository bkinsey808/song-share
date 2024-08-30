"use client";

import { Unsubscribe, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { safeParse } from "valibot";

import { SongSetSchema } from "../sections/song-set/schemas";
import { SongSchema } from "../sections/song/schemas";
import { useAppStore } from "@/features/app-store/useAppStore";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import { UserPublicDocSchema } from "@/features/firebase/schemas";

export const FollowingProvider = ({ children }: { children: ReactNode }) => {
	const params = useParams();
	const fuid = params.fuid;
	const { setFuid, setFollowing, setSong, setSongSet } = useAppStore();

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

				if (following.songSetActiveId) {
					const songSetUnsubscribe = onSnapshot(
						doc(db, collection.SONG_SETS, following.songSetActiveId),
						(songSetSnapshot) => {
							if (!songSetSnapshot.exists) {
								console.warn("Song set does not exist");
								return;
							}
							const songSetData = songSetSnapshot.data();
							if (!songSetData) {
								console.warn("No song set data found");
								return;
							}
							const songSetResult = safeParse(SongSetSchema, songSetData);
							if (!songSetResult.success) {
								console.warn("Invalid song set data");
								return;
							}
							const songSet = songSetResult.output;
							setSongSet(songSet);
							const songSetForm = useAppStore.getState().songSetForm;
							songSetForm?.reset?.(songSet);
						},
					);
					unsubscribeFns.push(songSetUnsubscribe);
				}
			},
		);

		unsubscribeFns.push(userPublicUnsubscribe);

		return () => {
			unsubscribeFns.forEach((fn) => fn());
			setFuid(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fuid, setFuid, setFollowing, setSong, setSongSet]);

	return <>{children}</>;
};
