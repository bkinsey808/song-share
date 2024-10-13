import { Get } from "@/features/app-store/types";

export const playlistSongAddButtonShow = (get: Get) => () => {
	const { songId, playlistId } = get();

	if (!songId || !playlistId) {
		return false;
	}

	const playlist = get().playlistLibrary[playlistId];

	if (!playlist) {
		return false;
	}

	const songs = playlist.songs;
	if (!songs) {
		return false;
	}

	return !songs.find((song) => song.songId === songId);
};
