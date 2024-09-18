import { Get, Set as SetType } from "@/features/app-store/types";

export const playlistLibraryAddPlaylistIds =
	(get: Get, set: SetType) => (playlistIds: string[]) => {
		const currentPlaylistIds = get().playlistIds;
		const newPlaylistIds = Array.from(
			new Set([...currentPlaylistIds, ...playlistIds]),
		);
		set({ playlistIds: newPlaylistIds });
	};
