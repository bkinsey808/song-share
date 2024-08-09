import { Get } from "@/features/app-store/types";
import { AppModal } from "@/features/modal/enums";

export const songDeleteClick = (get: Get) => () => {
	const { setAppModal } = get();
	setAppModal(AppModal.SONG_DELETE_CONFIRM);
};
