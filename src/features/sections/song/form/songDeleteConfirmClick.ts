import { songLogFormDefaultGet } from "../../song-log/songLogFormDefaultGet";
import { songDelete } from "@/actions/songDelete";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/consts";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type SongDeleteConfirmClick = (
	get: AppSliceGet,
	set: AppSliceSet,
) => () => Promise<void>;

export const songDeleteConfirmClick: SongDeleteConfirmClick =
	(get, set) => async () => {
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
		songLogForm?.reset(songLogFormDefaultGet());

		if (!songIdToDelete) {
			toast({
				variant: "destructive",
				title: "No song selected",
			});
			setOpenAppModal(null);
			return;
		}

		const result = await songDelete(songIdToDelete);
		if (result.actionResultType === ActionResultType.ERROR) {
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
