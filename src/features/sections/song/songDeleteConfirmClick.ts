import { Song } from "./types";
import { songDelete } from "@/actions/songDelete";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import { OldGet, OldSet } from "@/features/app-store/types";
import { useAppSliceStore } from "@/features/app-store/useAppStore";

export const songDeleteConfirmClick =
	(get: OldGet, set: OldSet) => async () => {
		set({
			deletingSong: true,
		});
		console.log("song deletee confirm click");
		const username = useAppSliceStore.getState().sessionCookieData?.username;
		const { songForm, songLibrary, songId } = get();
		if (!songForm) {
			console.error("no form");
			return;
		}
		if (!songId) {
			toast({
				variant: "destructive",
				title: "No song selected",
			});
			useAppSliceStore.getState().setAppModal(null);
			return;
		}
		const result = await songDelete(songId);
		if (result.actionResultType === ActionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error deleting the song",
			});
			useAppSliceStore.getState().setAppModal(null);
			return;
		}
		delete songLibrary[songId];
		const song: Song = {
			songName: "",
			credits: "",
			lyrics: "",
			translation: "",
			sharer: username ?? "",
		};
		set({
			songId: null,
			song,
			songLibrary,
			deletingSong: false,
		});
		songForm.reset(song);
		useAppSliceStore.getState().setAppModal(null);
	};
