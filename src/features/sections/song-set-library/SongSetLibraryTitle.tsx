"use client";

import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const SongSetLibraryTitle = () => {
	const { songSetLibrary } = useAppStore();
	const numberOfSongSets = getKeys(songSetLibrary).length;

	return (
		<>
			<div>SongSet Library{numberOfSongSets ? `: ` : null}</div>
			<div className="overflow-hidden text-ellipsis text-nowrap">
				({numberOfSongSets})
			</div>
		</>
	);
};
