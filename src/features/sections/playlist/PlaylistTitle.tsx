"use client";

import { usePlaylist } from "./slice";

export const PlaylistTitle = () => {
	const playlist = usePlaylist();

	return <span>{playlist?.playlistName}</span>;
};
