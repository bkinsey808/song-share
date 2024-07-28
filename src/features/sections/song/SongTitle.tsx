"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const SongTitle = () => {
	const { songName } = useAppStore();

	return (
		<div>
			<span>Song{songName ? `: ` : null}</span>
			<span className="overflow-hidden text-ellipsis text-nowrap">
				{songName}
			</span>
		</div>
	);
};
