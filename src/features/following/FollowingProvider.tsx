"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { safeParse } from "valibot";

import { songGet } from "@/actions/songGet";
import { songSetGet } from "@/actions/songSetGet";
import { actionResultType } from "@/features/app-store/consts";
import { useAppStore } from "@/features/app-store/useAppStore";
import { collection } from "@/features/firebase/consts";
import { db } from "@/features/firebase/firebaseClient";
import { PublicUserDocSchema } from "@/features/firebase/schemas";

export const FollowingProvider = ({ children }: { children: ReactNode }) => {
	const params = useParams();
	const fuid = params.fuid;
	const { setFuid, setFollowing, songId, songSetId, setSong, setSongSet } =
		useAppStore();

	useEffect(() => {
		setFollowing(null);

		if (!fuid || typeof fuid !== "string") {
			setFuid(null);
			console.warn("Invalid fuid");
			return;
		}

		setFuid(fuid);

		const unsubscribe = onSnapshot(
			doc(db, collection.PUBLIC_USERS, fuid),
			(snapshot) => {
				if (!snapshot.exists) {
					console.warn("publicUsers document does not exist!");
					return;
				}
				const followingData = snapshot.data();
				if (!followingData) {
					console.warn("No publicUsers data found");
					return;
				}
				const followingResult = safeParse(PublicUserDocSchema, followingData);
				if (!followingResult.success) {
					console.warn("Invalid data");
					return;
				}
				const following = followingResult.output;
				setFollowing(following);
				void (async () => {
					if (following.activeSongId && following.activeSongId !== songId) {
						const songResult = await songGet(following.activeSongId);
						if (songResult.actionResultType === actionResultType.ERROR) {
							console.warn("Failed to get song");
							return;
						}
						setSong(songResult.song);
					}
					if (
						following.activeSongSetId &&
						following.activeSongSetId !== songSetId
					) {
						const songSetResult = await songSetGet(following.activeSongSetId);
						if (songSetResult.actionResultType === actionResultType.ERROR) {
							console.warn("Failed to get song set");
							return;
						}
						setSongSet(songSetResult.songSet);
					}
				})();
			},
		);

		return () => {
			unsubscribe();
			setFuid(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fuid, setFuid, setFollowing, setSong, setSongSet]);

	return <>{children}</>;
};
