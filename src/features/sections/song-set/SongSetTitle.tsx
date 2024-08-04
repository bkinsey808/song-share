"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const SongSetTitle = () => {
	const { songSet } = useAppStore();

	return (
		<div>
			<span>Song Set{songSet?.songSetName ? `: ` : null}</span>
			<span className="overflow-hidden text-ellipsis text-nowrap">
				{songSet?.songSetName}
			</span>
		</div>
	);
};
