"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const LyricsTitle = () => {
	const { song } = useAppStore();

	return (
		<div className="flex-grow overflow-hidden text-ellipsis text-nowrap">
			<span>Lyrics{song?.lyrics ? `: ${song?.lyrics}` : null}</span>
		</div>
	);
};
