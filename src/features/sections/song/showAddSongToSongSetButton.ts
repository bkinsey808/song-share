import { Get } from "@/features/app-store/types";

export const showAddSongToSongSetButton = (get: Get) => () => {
	const { songId, songSetId, songSet } = get();
	if (!songId || !songSetId || !songSet) {
		return false;
	}

	const songSetSongList = songSet.songSetSongList;
	if (!songSetSongList) {
		return false;
	}

	return !songSetSongList.includes(songId);
};
