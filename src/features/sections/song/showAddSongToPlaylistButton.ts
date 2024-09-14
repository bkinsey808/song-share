import { Get } from "@/features/app-store/types";

export const showAddSongToPlaylistButton = (get: Get) => () => {
	const { songId, playlistId, playlist } = get();
	if (!songId || !playlistId || !playlist) {
		return false;
	}

	const songIds = playlist.songIds;
	if (!songIds) {
		return false;
	}

	return !songIds.includes(songId);
};
