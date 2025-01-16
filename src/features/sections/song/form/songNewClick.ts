import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type SongNewClick = (get: AppSliceGet, set: AppSliceSet) => () => void;

export const songNewClick: SongNewClick = (get, set) => () => {
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
	});

	songForm.setFocus("songName");
};
