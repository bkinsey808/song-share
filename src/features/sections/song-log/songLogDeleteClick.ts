import { Get } from "@/features/app-store/types";
import { appModal } from "@/features/modal/consts";

export const songLogDeleteClick = (get: Get) => () => {
	const { setOpenAppModal } = get();
	setOpenAppModal(appModal.SONG_LOG_DELETE_CONFIRM);
};
