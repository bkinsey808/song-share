import { Unsubscribe } from "firebase/firestore";
import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { songSetLibraryUpdate } from "../song/songSetLibraryUpdate";
import { songSetLoadClick } from "./songSetLoadClick";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { SongSet } from "@/features/sections/song-set/types";

type SongSetLibrarySliceState = {
	songSetIds: string[];
	songSetLibrary: Record<string, SongSet>;
	songSetUnsubscribeFns: Record<string, Unsubscribe>;
};

const songSetLibrarySliceInitialState: SongSetLibrarySliceState = {
	songSetIds: [],
	songSetLibrary: {},
	songSetUnsubscribeFns: {},
};

export type SongSetLibrarySlice = SongSetLibrarySliceState & {
	songSetLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songSetLibraryUpdate: () => void;
};

type AppSongLibrarySlice = StateCreator<AppSlice, [], [], SongSetLibrarySlice>;

export const createSongSetLibrarySlice: AppSongLibrarySlice = (set, get) => {
	sliceResetFns.add(() => set(songSetLibrarySliceInitialState));
	return {
		...songSetLibrarySliceInitialState,
		songSetLoadClick: songSetLoadClick(get, set),
		songSetLibraryUpdate: songSetLibraryUpdate(get, set),
	};
};
