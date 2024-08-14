import { Song } from "./types";
import { songDelete } from "@/actions/songDelete";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";

export const songDeleteConfirmClick = (get: Get, set: Set) => async () => {
	set({
		deletingSong: true,
	});
	const username = useAppStore.getState().sessionCookieData?.username;
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
		useAppStore.getState().setOpenAppModal(null);
		return;
	}
	const result = await songDelete(songId);
	if (result.actionResultType === actionResultType.ERROR) {
		toast({
			variant: "destructive",
			title: "There was an error deleting the song",
		});
		useAppStore.getState().setOpenAppModal(null);
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
	useAppStore.getState().setOpenAppModal(null);
};
