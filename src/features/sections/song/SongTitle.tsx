"use client";

import { JSX } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";

export const SongTitle = (): JSX.Element => {
	const { songId, songNameGet } = useAppStore();

	return <span>{songNameGet(songId)}</span>;
};
