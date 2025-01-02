import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type PlaylistLibraryAddPlaylistIds = (
	get: AppSliceGet,
	set: AppSliceSet,
) => (playlistIds: string[]) => void;

export const playlistLibraryAddPlaylistIds: PlaylistLibraryAddPlaylistIds =
	(get, set) => (playlistIds) => {
		const currentPlaylistIds = get().playlistIds;
		const newPlaylistIds = Array.from(
			new Set([...currentPlaylistIds, ...playlistIds]),
		);
		set({ playlistIds: newPlaylistIds });
	};
