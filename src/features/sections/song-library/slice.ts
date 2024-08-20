import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { songLoadClick } from "./songLoadClick";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Song } from "@/features/sections/song/types";

type SongLibrarySliceState = {
	songLibrary: Record<string, Song>;
};

const songLibrarySliceInitialState: SongLibrarySliceState = {
	songLibrary: {},
};

export type SongLibrarySlice = SongLibrarySliceState & {
	songLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
};

type AppSongLibrarySlice = StateCreator<AppSlice, [], [], SongLibrarySlice>;

export const createSongLibrarySlice: AppSongLibrarySlice = (set, get) => {
	sliceResetFns.add(() => set(songLibrarySliceInitialState));
	return {
		...songLibrarySliceInitialState,
		songLoadClick: songLoadClick(get, set),
	};
};
