"use client";

import { JSX } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const SongRequestsTitle = (): JSX.Element => {
	const { songRequests } = useAppStore();
	const numberOfSongs = getKeys(songRequests ?? {}).length;

	return (
		<span>
			{numberOfSongs} song{numberOfSongs === 1 ? "" : "s"}
		</span>
	);
};
