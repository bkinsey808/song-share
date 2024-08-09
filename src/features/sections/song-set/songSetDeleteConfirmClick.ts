import { SongSet } from "./types";
import { songSetDelete } from "@/actions/songSetDelete";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";

export const songSetDeleteConfirmClick = (get: Get, set: Set) => async () => {
	set({
		deletingSongSet: true,
	});
	console.log("song set delete confirm click");
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
		useAppStore.getState().setAppModal(null);
		return;
	}
	const result = await songSetDelete(songSetId);
	if (result.actionResultType === ActionResultType.ERROR) {
		toast({
			variant: "destructive",
			title: "There was an error deleting the song set",
		});
		useAppStore.getState().setAppModal(null);
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
	useAppStore.getState().setAppModal(null);
};
