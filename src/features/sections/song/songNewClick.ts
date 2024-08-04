import { Song } from "./types";
import { Get, Set } from "@/features/app-store/types";
import { useAuthStore } from "@/features/auth/useAuthStore";

export const songNewClick = (get: Get, set: Set) => () => {
	const username = useAuthStore.getState().sessionCookieData?.username;
	const form = get().songForm;
	if (!form) {
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
			sharer: username ?? null,
		},
	});
	const newSong: Song = {
		songName: "",
		credits: "",
		lyrics: "",
		translation: "",
		sharer: username ?? "",
	};
	form.reset(newSong);
};
