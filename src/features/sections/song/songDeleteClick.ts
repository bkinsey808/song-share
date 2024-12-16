import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { appModal } from "@/features/modal/consts";

export const songDeleteClick =
	(get: AppSliceGet, set: AppSliceSet) => (songId: string) => () => {
		const { setOpenAppModal } = get();
		set({ songIdToDelete: songId });
		setOpenAppModal(appModal.SONG_DELETE_CONFIRM);
	};
