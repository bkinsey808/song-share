import { Get } from "@/features/app-store/types";

export const showAddSongToSongSetButton = (get: Get) => () => {
	const { songId, songSetId, songSet } = get();
	if (!songId || !songSetId || !songSet) {
		return false;
	}

	const songIds = songSet.songIds;
	if (!songIds) {
		return false;
	}

	return !songIds.includes(songId);
};
