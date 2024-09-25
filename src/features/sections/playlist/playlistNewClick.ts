import { Playlist } from "./types";
import { Get, Set } from "@/features/app-store/types";

export const playlistNewClick = (get: Get, set: Set) => () => {
	const { sessionCookieData, playlistForm } = get();
	const uid = sessionCookieData?.uid;
	if (!uid) {
		console.error("no uid");
		return;
	}

	if (!playlistForm) {
		console.error("no form");
		return;
	}

	const playlist: Playlist = {
		playlistName: "",
		sharer: uid,
		songs: [],
	};

	set({
		playlistId: null,
		playlist,
	});

	playlistForm.setFocus("playlistName");
	playlistForm.reset(playlist);
};
