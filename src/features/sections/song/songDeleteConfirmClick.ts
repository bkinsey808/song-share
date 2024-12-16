import { songLogDefaultGet } from "../song-log/songLogDefaultGet";
import { songDelete } from "@/actions/songDelete";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const songDeleteConfirmClick =
	(get: AppSliceGet, set: AppSliceSet) => async () => {
		set({
			songDeleting: true,
		});
		const {
			songForm,
			songLogForm,
			songDefaultGet,
			songLibrary,
			songIdToDelete,
			setOpenAppModal,
		} = get();

		if (!songForm) {
			console.error("no form");
			return;
		}

		songForm?.reset(songDefaultGet());
		songLogForm?.reset(songLogDefaultGet());

		if (!songIdToDelete) {
			toast({
				variant: "destructive",
				title: "No song selected",
			});
			setOpenAppModal(null);
			return;
		}

		const result = await songDelete(songIdToDelete);
		if (result.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error deleting the song",
			});
			setOpenAppModal(null);
			return;
		}

		delete songLibrary[songIdToDelete];

		set({
			songId: null,
			songLibrary,
			songDeleting: false,
			songIds: result.songIds,
			songIdToDelete: null,
		});
		setOpenAppModal(null);
	};
