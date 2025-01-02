import { AppSliceGet } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { appModal } from "@/features/modal/consts";

type PlaylistDeleteClick = (_get: AppSliceGet) => () => void;

export const playlistDeleteClick: PlaylistDeleteClick = (_get) => () => {
	useAppStore.getState().setOpenAppModal(appModal.SONG_SET_DELETE_CONFIRM);
};
