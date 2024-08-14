import { SongSet } from "./types";
import { songSetDelete } from "@/actions/songSetDelete";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";

export const songSetDeleteConfirmClick = (get: Get, set: Set) => async () => {
	set({
		deletingSongSet: true,
	});
	const username = useAppStore.getState().sessionCookieData?.username;
	const { songSetForm, songSetLibrary, songSetId } = get();
	if (!songSetForm) {
		console.error("no form");
		return;
	}
	if (!songSetId) {
		toast({
			variant: "destructive",
			title: "No song set selected",
		});
		useAppStore.getState().setOpenAppModal(null);
		return;
	}
	const result = await songSetDelete(songSetId);
	if (result.actionResultType === actionResultType.ERROR) {
		toast({
			variant: "destructive",
			title: "There was an error deleting the song set",
		});
		useAppStore.getState().setOpenAppModal(null);
		return;
	}
	delete songSetLibrary[songSetId];
	const songSet: SongSet = {
		songSetName: "",
		sharer: username ?? "",
		songSetSongList: [],
		songSetSongs: {},
	};
	set({
		songSetId: null,
		songSet,
		songSetLibrary,
		deletingSongSet: false,
	});
	songSetForm.reset(songSet);
	useAppStore.getState().setOpenAppModal(null);
};
