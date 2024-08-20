import { StateCreator } from "zustand";

import { AppModal } from "./types";
import { AppSlice } from "@/features/app-store/useAppStore";

type ModalSliceState = {
	openAppModal: AppModal | null;
};

export const modalSliceInitialState: ModalSliceState = {
	openAppModal: null,
};

export type ModalSlice = ModalSliceState & {
	setOpenAppModal: (modal: AppModal | null) => void;
};

type AppModalSlice = StateCreator<AppSlice, [], [], ModalSlice>;

export const createModalSlice: AppModalSlice = (set, _get) => ({
	...modalSliceInitialState,
	setOpenAppModal: (modal) => set({ openAppModal: modal }),
});
