"use client";

import { JSX } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";

export const SongLogTitle = (): JSX.Element => {
	const { songId, songLogIdsGet } = useAppStore();
	const songLogIds = songLogIdsGet(songId);
	const numberOfLogs = songLogIds.length;

	return (
		<span>
			{numberOfLogs} log{numberOfLogs === 1 ? "" : "s"}
		</span>
	);
};
