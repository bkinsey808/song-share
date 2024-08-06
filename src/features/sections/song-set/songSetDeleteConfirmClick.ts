import { SongSet } from "./types";
import { songSetDelete } from "@/actions/songSetDelete";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import { OldGet, OldSet } from "@/features/app-store/types";
import { useAppSliceStore } from "@/features/app-store/useAppStore";

export const songSetDeleteConfirmClick =
	(get: OldGet, set: OldSet) => async () => {
		set({
			deletingSongSet: true,
		});
		console.log("song set delete confirm click");
		const username = useAppSliceStore.getState().sessionCookieData?.username;
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
			useAppSliceStore.getState().setAppModal(null);
			return;
		}
		const result = await songSetDelete(songSetId);
		if (result.actionResultType === ActionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error deleting the song set",
			});
			useAppSliceStore.getState().setAppModal(null);
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
		useAppSliceStore.getState().setAppModal(null);
	};
