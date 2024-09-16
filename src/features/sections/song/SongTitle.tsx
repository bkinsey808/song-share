"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const SongTitle = () => {
	const { song } = useAppStore();

	return <span>{song?.songName}</span>;
};
