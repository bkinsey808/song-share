"use client";

import { useAppStore } from "@/features/app-store/useAppStore";

export const PlaylistTitle = () => {
	const { playlist } = useAppStore();

	return (
		<span>
				{playlist?.playlistName}
		</span>
	);
};
