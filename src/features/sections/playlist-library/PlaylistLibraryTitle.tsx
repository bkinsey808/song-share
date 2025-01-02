"use client";

import { JSX } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const PlaylistLibraryTitle = (): JSX.Element => {
	const { playlistLibrary } = useAppStore();
	const numberOfPlaylists = getKeys(playlistLibrary).length;

	return (
		<span>
			{numberOfPlaylists} playlist{numberOfPlaylists === 1 ? "" : "s"}
		</span>
	);
};
