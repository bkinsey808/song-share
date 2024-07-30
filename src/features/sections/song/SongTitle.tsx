"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const SongTitle = () => {
	const { song } = useAppStore();

	return (
		<div>
			<span>Song{song?.songName ? `: ` : null}</span>
			<span className="overflow-hidden text-ellipsis text-nowrap">
				{song?.songName}
			</span>
		</div>
	);
};
