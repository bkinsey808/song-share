import { Song } from "./types";
import { songDelete } from "@/actions/songDelete";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";

export const songDeleteConfirmClick = (get: Get, set: Set) => async () => {
	set({
		songDeleting: true,
	});
	const { songForm, songLibrary, songId, sessionCookieData, setOpenAppModal } =
		get();
	const uid = sessionCookieData?.uid;
	if (!songForm) {
		console.error("no form");
		return;
	}
	if (!songId) {
		toast({
			variant: "destructive",
			title: "No song selected",
		});
		setOpenAppModal(null);
		return;
	}
	const result = await songDelete(songId);
	if (result.actionResultType === actionResultType.ERROR) {
		toast({
			variant: "destructive",
			title: "There was an error deleting the song",
		});
		setOpenAppModal(null);
		return;
	}
	delete songLibrary[songId];
	const song: Song = {
		songName: "",
		credits: "",
		lyrics: "",
		translation: "",
		sharer: uid ?? "",
		playlistIds: [],
	};
	set({
		songId: null,
		song,
		songLibrary,
		songDeleting: false,
		songIds: result.songIds,
	});
	songForm.reset(song);
	setOpenAppModal(null);
};
