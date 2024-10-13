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
	});

	songForm.setFocus("songName");
};
