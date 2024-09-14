"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const PlaylistTitle = () => {
	const { playlist } = useAppStore();

	return (
		<div>
			<span>Playlist{playlist?.playlistName ? `: ` : null}</span>
			<span className="overflow-hidden text-ellipsis text-nowrap">
				{playlist?.playlistName}
			</span>
		</div>
	);
};
