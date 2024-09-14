import { Song } from "./types";
import { Get, Set } from "@/features/app-store/types";

export const songNewClick = (get: Get, set: Set) => () => {
	const { sessionCookieData, songForm } = get();
	const uid = sessionCookieData?.uid;
	if (!uid) {
		console.error("no uid");
		return;
	}

	if (!songForm) {
		console.error("no form");
		return;
	}

	const newSong: Song = {
		songName: "",
		credits: "",
		lyrics: "",
		translation: "",
		sharer: uid,
		playlistIds: [],
	};

	set({
		songId: null,
		song: newSong,
	});

	songForm.setFocus("songName");
	songForm.reset(newSong);
};
