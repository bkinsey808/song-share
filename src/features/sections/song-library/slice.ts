import { Unsubscribe } from "firebase/firestore";
import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { songLibrarySort, songLibrarySortData } from "./consts";
import { songLibraryAddSongIds } from "./songLibraryAddSongIds";
import { songLibrarySubscribe } from "./songLibrarySubscribe";
import { songLibraryUnsubscribe } from "./songLibraryUnsubscribe";
import { songLoadClick } from "./songLoadClick";
import { SongLibrarySort } from "./types";
import {
	AppSlice,
	sliceResetFns,
	useAppStore,
} from "@/features/app-store/useAppStore";
import { Song } from "@/features/sections/song/types";

type SongLibrarySliceState = {
	songIds: string[];
	songLibrary: Record<string, Song>;
	songUnsubscribeFns: Record<string, Unsubscribe>;
	songLibrarySort: SongLibrarySort | null;
};

const songLibrarySliceInitialState: SongLibrarySliceState = {
	songIds: [],
	songLibrary: {},
	songUnsubscribeFns: {},
	songLibrarySort: songLibrarySort.SONG_NAME_ASC,
};

export type SongLibrarySlice = SongLibrarySliceState & {
	songLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songLibrarySubscribe: () => void;
	songLibraryUnsubscribe: () => void;
	songLibraryAddSongIds: (songIds: string[]) => void;
	songLibrarySortSet: (sort: SongLibrarySort) => () => void;
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
		songLibrarySortSet: (sort) => () => {
			set({
				songLibrarySort: sort,
			});
		},
	};
};

export const useSongLibrarySortData = () =>
	useAppStore((state) =>
		state.songLibrarySort
			? songLibrarySortData[state.songLibrarySort]
			: undefined,
	);

export const useSortedSongIds = () =>
	useAppStore((state) => {
		const sortData = state.songLibrarySort
			? songLibrarySortData[state.songLibrarySort]
			: undefined;
		if (!sortData) {
			return [];
		}
		return [...state.songIds].sort(sortData.sort(state.songLibrary));
	});
