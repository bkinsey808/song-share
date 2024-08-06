import { StateCreator } from "zustand";

import { AppModal } from "./enums";
import { AppSlice } from "@/features/app-store/useAppStore";

export type ModalSlice = {
	appModal: AppModal | null;
	setAppModal: (modal: AppModal | null) => void;
};

type AppModalSlice = StateCreator<AppSlice, [], [], ModalSlice>;

export const createModalSlice: AppModalSlice = (set, get) => ({
	appModal: null,
	setAppModal: (modal) => set({ appModal: modal }),
});
