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

	set({
		songId: null,
		song: {
			songName: null,
			credits: null,
			lyrics: null,
			translation: null,
			sharer: uid,
		},
	});

	const newSong: Song = {
		songName: "",
		credits: "",
		lyrics: "",
		translation: "",
		sharer: uid,
	};

	songForm.reset(newSong);
};
