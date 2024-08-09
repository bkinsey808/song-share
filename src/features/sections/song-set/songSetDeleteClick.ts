import { Get } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { AppModal } from "@/features/modal/enums";

export const songSetDeleteClick = (get: Get) => () => {
	useAppStore.getState().setAppModal(AppModal.SONG_SET_DELETE_CONFIRM);
};
