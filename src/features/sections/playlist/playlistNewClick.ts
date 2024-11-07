import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const playlistNewClick = (get: AppSliceGet, set: AppSliceSet) => () => {
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
