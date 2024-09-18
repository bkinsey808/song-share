import { Get, Set as SetType } from "@/features/app-store/types";

export const songLibraryAddSongIds =
	(get: Get, set: SetType) => (songIds: string[]) => {
		const currentSongIds = get().songIds;
		const newSongIds = Array.from(new Set([...currentSongIds, ...songIds]));
		set({ songIds: newSongIds });
	};
