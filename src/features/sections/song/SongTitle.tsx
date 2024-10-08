"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const SongTitle = () => {
	const { songId, songNameGet } = useAppStore();

	return <span>{songNameGet(songId)}</span>;
};
