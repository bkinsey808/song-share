import { Get } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { appModal } from "@/features/modal/consts";

export const playlistDeleteClick = (_get: Get) => () => {
	useAppStore.getState().setOpenAppModal(appModal.SONG_SET_DELETE_CONFIRM);
};
