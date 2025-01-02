import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type PlaylistNewClick = (get: AppSliceGet, set: AppSliceSet) => () => void;

export const playlistNewClick: PlaylistNewClick = (get, set) => () => {
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
