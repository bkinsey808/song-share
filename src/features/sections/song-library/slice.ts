import { Unsubscribe } from "firebase/firestore";
import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { songLibraryAddSongIds } from "./songLibraryAddSongIds";
import { songLibrarySubscribe } from "./songLibrarySubscribe";
import { songLibraryUnsubscribe } from "./songLibraryUnsubscribe";
import { songLoadClick } from "./songLoadClick";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Song } from "@/features/sections/song/types";

type SongLibrarySliceState = {
	songIds: string[];
	songLibrary: Record<string, Song>;
	songUnsubscribeFns: Record<string, Unsubscribe>;
};

const songLibrarySliceInitialState: SongLibrarySliceState = {
	songIds: [],
	songLibrary: {},
	songUnsubscribeFns: {},
};

export type SongLibrarySlice = SongLibrarySliceState & {
	songLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songLibrarySubscribe: () => void;
	songLibraryUnsubscribe: () => void;
	songLibraryAddSongIds: (songIds: string[]) => void;
};

type AppSongLibrarySlice = StateCreator<AppSlice, [], [], SongLibrarySlice>;

export const createSongLibrarySlice: AppSongLibrarySlice = (set, get) => {
	sliceResetFns.add(() => set(songLibrarySliceInitialState));
	return {
		...songLibrarySliceInitialState,
		songLoadClick: songLoadClick(get, set),
		songLibrarySubscribe: songLibrarySubscribe(get, set),
		songLibraryUnsubscribe: songLibraryUnsubscribe(get),
		songLibraryAddSongIds: songLibraryAddSongIds(get, set),
	};
};
