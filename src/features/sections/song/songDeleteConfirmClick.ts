import { Song } from "./types";
import { songDelete } from "@/actions/songDelete";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import { Get, Set } from "@/features/app-store/types";
import { useAuthStore } from "@/features/auth/useAuthStore";

export const songDeleteConfirmClick = (get: Get, set: Set) => async () => {
	set({
		deletingSong: true,
	});
	console.log("song deletee confirm click");
	const username = useAuthStore.getState().sessionCookieData?.username;
	const { songForm, songLibrary, songId, setAppModal } = get();
	if (!songForm) {
		console.error("no form");
		return;
	}
	if (!songId) {
		toast({
			variant: "destructive",
			title: "No song selected",
		});
		setAppModal(null);
		return;
	}
	const result = await songDelete(songId);
	if (result.actionResultType === ActionResultType.ERROR) {
		toast({
			variant: "destructive",
			title: "There was an error deleting the song",
		});
		setAppModal(null);
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
	setAppModal(null);
};
