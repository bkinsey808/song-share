"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const SongLogTitle = () => {
	const { songId, songLogIdsGet } = useAppStore();
	const songLogIds = songLogIdsGet(songId);
	const numberOfLogs = songLogIds.length;

	return (
		<span>
			{numberOfLogs} log{numberOfLogs === 1 ? "" : "s"}
		</span>
	);
};
