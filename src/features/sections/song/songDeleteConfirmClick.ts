import { songLogDefaultGet } from "../song-log/songLogDefaultGet";
import { songDelete } from "@/actions/songDelete";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";

export const songDeleteConfirmClick = (get: Get, set: Set) => async () => {
	set({
		songDeleting: true,
	});
	const {
		songForm,
		songLogForm,
		songDefaultGet,
		songLibrary,
		songId,
		setOpenAppModal,
	} = get();

	if (!songForm) {
		console.error("no form");
		return;
	}

	songForm?.reset(songDefaultGet());
	songLogForm?.reset(songLogDefaultGet());

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

	set({
		songId: null,
		songLibrary,
		songDeleting: false,
		songIds: result.songIds,
	});
	setOpenAppModal(null);
};
