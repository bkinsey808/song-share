import { create } from "zustand";

import { SongLibrary } from "../music/types";

interface AppStore {
	songId: string | null;
	songName: string | null;
	sharer: string | null;
	credits: string | null;

	songLibrary: SongLibrary;
}

export const useAppStore = create<AppStore>()((_set, _get) => ({
	songName: null,
	songId: null,
	sharer: null,
	credits: null,
	songLibrary: {},
}));
