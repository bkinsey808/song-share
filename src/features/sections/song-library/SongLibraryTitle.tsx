"use client";

import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const SongLibraryTitle = () => {
	const { songLibrary } = useAppStore();
	const numberOfSongs = getKeys(songLibrary).length;

	return (
		<span>
			{numberOfSongs} song{numberOfSongs === 1 ? "" : "s"}
		</span>
	);
};
