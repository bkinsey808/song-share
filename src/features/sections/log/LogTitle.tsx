"use client";

import { useSongLogs } from "@/features/sections/song-log/slice";

export const LogTitle = () => {
	const songLogs = useSongLogs();
	const numberOfLogs = songLogs.length;

	return (
		<span>
			{numberOfLogs} log{numberOfLogs === 1 ? "" : "s"}
		</span>
	);
};
