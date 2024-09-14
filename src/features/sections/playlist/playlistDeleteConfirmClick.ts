import { Playlist } from "./types";
import { playlistDelete } from "@/actions/playlistDelete";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";

export const playlistDeleteConfirmClick = (get: Get, set: Set) => async () => {
	set({
		deletingPlaylist: true,
	});
	const {
		playlistForm,
		playlistLibrary,
		playlistId,
		sessionCookieData,
		setOpenAppModal,
	} = get();
	const uid = sessionCookieData?.uid;
	if (!uid) {
		console.error("no uid");
	}
	if (!playlistForm) {
		console.error("no form");
		return;
	}
	if (!playlistId) {
		toast({
			variant: "destructive",
			title: "No song set selected",
		});
		setOpenAppModal(null);
		return;
	}
	const result = await playlistDelete(playlistId);
	if (result.actionResultType === actionResultType.ERROR) {
		toast({
			variant: "destructive",
			title: "There was an error deleting the song set",
		});
		setOpenAppModal(null);
		return;
	}
	delete playlistLibrary[playlistId];
	const playlist: Playlist = {
		playlistName: "",
		sharer: uid ?? "",
		songIds: [],
	};
	set({
		playlistId: null,
		playlist,
		playlistLibrary,
		deletingPlaylist: false,
		playlistIds: result.playlistIds,
	});
	playlistForm.reset(playlist);
	setOpenAppModal(null);
};
