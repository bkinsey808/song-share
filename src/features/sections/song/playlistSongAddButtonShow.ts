import { AppSliceGet } from "@/features/app-store/types";

type PlaylistSongAddButtonShow = (get: AppSliceGet) => () => boolean;

export const playlistSongAddButtonShow: PlaylistSongAddButtonShow =
	(get) => () => {
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
