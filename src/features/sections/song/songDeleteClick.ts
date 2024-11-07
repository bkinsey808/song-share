import { AppSliceGet } from "@/features/app-store/types";
import { appModal } from "@/features/modal/consts";

export const songDeleteClick = (get: AppSliceGet) => () => {
	const { setOpenAppModal } = get();
	setOpenAppModal(appModal.SONG_DELETE_CONFIRM);
};
