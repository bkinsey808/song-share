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

	set({
		playlistId: null,
	});

	playlistForm.setFocus("playlistName");
};
