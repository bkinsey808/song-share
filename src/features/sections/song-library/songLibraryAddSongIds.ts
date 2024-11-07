import {
	AppSliceGet,
	AppSliceSet as SetType,
} from "@/features/app-store/types";

export const songLibraryAddSongIds =
	(get: AppSliceGet, set: SetType) => (songIds: string[]) => {
		const currentSongIds = get().songIds;
		const newSongIds = Array.from(new Set([...currentSongIds, ...songIds]));
		set({ songIds: newSongIds });
	};
