"use client";

import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const SongLibraryTitle = () => {
	const { songLibrary } = useAppStore();
	const numberOfSongs = getKeys(songLibrary).length;

	return (
		<>
			<div>Song Library{numberOfSongs ? `: ` : null}</div>
			<div className="overflow-hidden text-ellipsis text-nowrap">
				({numberOfSongs})
			</div>
		</>
	);
};
