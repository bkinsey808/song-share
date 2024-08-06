import { Song } from "./types";
import { OldGet, OldSet } from "@/features/app-store/types";
import { useAppSliceStore } from "@/features/app-store/useAppStore";

export const songNewClick = (get: OldGet, set: OldSet) => () => {
	const username = useAppSliceStore.getState().sessionCookieData?.username;
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
