import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { songSetLoadClick } from "./songSetLoadClick";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { SongSet } from "@/features/sections/song-set/types";

type SongSetLibrarySliceState = {
	songSetLibrary: Record<string, SongSet>;
};

const songSetLibrarySliceInitialState: SongSetLibrarySliceState = {
	songSetLibrary: {},
};

export type SongSetLibrarySlice = SongSetLibrarySliceState & {
	songSetLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
};

type AppSongLibrarySlice = StateCreator<AppSlice, [], [], SongSetLibrarySlice>;

export const createSongSetLibrarySlice: AppSongLibrarySlice = (set, get) => {
	sliceResetFns.add(() => set(songSetLibrarySliceInitialState));
	return {
		...songSetLibrarySliceInitialState,
		songSetLoadClick: songSetLoadClick(get, set),
	};
};
