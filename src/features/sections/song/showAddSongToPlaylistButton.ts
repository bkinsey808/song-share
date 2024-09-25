import { Get } from "@/features/app-store/types";

export const showAddSongToPlaylistButton = (get: Get) => () => {
	const { songId, playlistId, playlist } = get();
	if (!songId || !playlistId || !playlist) {
		return false;
	}

	const songs = playlist.songs;
	if (!songs) {
		return false;
	}

	return !songs.find((song) => song.songId === songId);
};
