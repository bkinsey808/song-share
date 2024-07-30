"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const SongSetTitle = () => {
	const { songSetName } = useAppStore();

	return (
		<div>
			<span>SongSet{songSetName ? `: ` : null}</span>
			<span className="overflow-hidden text-ellipsis text-nowrap">
				{songSetName}
			</span>
		</div>
	);
};
