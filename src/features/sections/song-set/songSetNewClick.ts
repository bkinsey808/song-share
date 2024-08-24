import { SongSet } from "./types";
import { Get, Set } from "@/features/app-store/types";

export const songSetNewClick = (get: Get, set: Set) => () => {
	const { sessionCookieData, songSetForm } = get();
	const uid = sessionCookieData?.uid;
	if (!uid) {
		console.error("no uid");
		return;
	}

	if (!songSetForm) {
		console.error("no form");
		return;
	}

	set({
		songSetId: null,
		songSet: {
			songSetName: null,
			sharer: uid,
			songSetSongList: [],
			songSetSongs: {},
		},
	});

	const songSet: SongSet = {
		songSetName: "",
		sharer: uid,
		songSetSongList: [],
		songSetSongs: {},
	};

	songSetForm.reset(songSet);
};
