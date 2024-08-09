import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";

export const songSetNewClick = (get: Get, set: Set) => () => {
	const username = useAppStore.getState().sessionCookieData?.username;
	const form = get().songSetForm;
	if (!form) {
		console.error("no form");
		return;
	}
	set({
		songSetId: null,
		songSet: {
			songSetName: null,
			sharer: username ?? null,
			songSetSongList: [],
			songSetSongs: {},
		},
	});
	form.reset({
		songSetName: "",
	});
};
