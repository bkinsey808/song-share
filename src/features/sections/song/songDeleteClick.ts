import { AppModal } from "@/features/app-store/enums";
import { Get } from "@/features/app-store/types";

export const songDeleteClick = (get: Get) => () => {
	console.log("songDeleteClick");
	const { setAppModal } = get();
	setAppModal(AppModal.SONG_DELETE_CONFIRM);
};
