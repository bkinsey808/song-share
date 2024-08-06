import { OldGet, OldSet } from "@/features/app-store/types";
import { useAppSliceStore } from "@/features/app-store/useAppStore";

export const songSetNewClick = (get: OldGet, set: OldSet) => () => {
	const username = useAppSliceStore.getState().sessionCookieData?.username;
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
