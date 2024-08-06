import { OldGet } from "@/features/app-store/types";
import { useAppSliceStore } from "@/features/app-store/useAppStore";
import { AppModal } from "@/features/modal/enums";

export const songDeleteClick = (get: OldGet) => () => {
	useAppSliceStore.getState().setAppModal(AppModal.SONG_DELETE_CONFIRM);
};
