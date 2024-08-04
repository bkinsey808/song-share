import { AppModal } from "@/features/app-store/enums";
import { Get } from "@/features/app-store/types";

export const songSetDeleteClick = (get: Get) => () => {
	console.log("songSetDeleteClick");
	const { setAppModal } = get();
	setAppModal(AppModal.SONG_SET_DELETE_CONFIRM);
};
