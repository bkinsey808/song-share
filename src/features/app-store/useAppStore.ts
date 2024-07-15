import { create } from "zustand";

import { SongLibrary } from "../music/types";
import { AppModal } from "./enums";

interface AppStore {
	appModal: AppModal | null;
	songId: string | null;
	songName: string | null;
	sharer: string | null;
	credits: string | null;
	songLibrary: SongLibrary;
	setAppModal: (modal: AppModal | null) => void;
}

export const useAppStore = create<AppStore>()((set, _get) => ({
	appModal: null,
	songName: null,
	songId: null,
	sharer: null,
	credits: null,
	songLibrary: {},
	setAppModal: (modal) => set({ appModal: modal }),
}));
