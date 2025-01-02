"use client";

import { JSX } from "react";

import { usePlaylist } from "./slice";

export const PlaylistTitle = (): JSX.Element => {
	const playlist = usePlaylist();

	return <span>{playlist?.playlistName}</span>;
};
