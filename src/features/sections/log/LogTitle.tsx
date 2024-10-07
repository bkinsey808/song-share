"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const LogTitle = () => {
	const { logIds } = useAppStore();
	const numberOfLogs = logIds.length;

	return (
		<span>
			{numberOfLogs} log{numberOfLogs === 1 ? "" : "s"}
		</span>
	);
};
