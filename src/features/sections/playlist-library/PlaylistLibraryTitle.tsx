"use client";

import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const PlaylistLibraryTitle = () => {
	const { playlistLibrary } = useAppStore();
	const numberOfPlaylists = getKeys(playlistLibrary).length;

	return (
		<>
			<div>Playlist Library{numberOfPlaylists ? `: ` : null}</div>
			<div className="overflow-hidden text-ellipsis text-nowrap">
				({numberOfPlaylists})
			</div>
		</>
	);
};
