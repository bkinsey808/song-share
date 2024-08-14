import { StateCreator } from "zustand";

import { appModal } from "./consts";
import { AppModal } from "./types";
import { AppSlice } from "@/features/app-store/useAppStore";

export type ModalSlice = {
	openAppModal: (typeof appModal)[keyof typeof appModal] | null;
	setOpenAppModal: (modal: AppModal | null) => void;
};

type AppModalSlice = StateCreator<AppSlice, [], [], ModalSlice>;

export const createModalSlice: AppModalSlice = (set, _get) => ({
	openAppModal: null,
	setOpenAppModal: (modal) => set({ openAppModal: modal }),
});
