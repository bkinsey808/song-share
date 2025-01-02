import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { appModal } from "@/features/modal/consts";

type SongDeleteClick = (
	get: AppSliceGet,
	set: AppSliceSet,
) => (songId: string) => () => void;

export const songDeleteClick: SongDeleteClick =
	(get, set) => (songId) => () => {
		const { setOpenAppModal } = get();
		set({ songIdToDelete: songId });
		setOpenAppModal(appModal.SONG_DELETE_CONFIRM);
	};
