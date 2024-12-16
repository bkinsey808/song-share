import { Unsubscribe } from "firebase/firestore";
import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { songLibraryGridFormSubmit } from "../playlist/songLibraryGridFormSubmit";
import { songLibrarySortData, songLibrarySortDefault } from "./consts";
import { songLibraryAddSongIds } from "./songLibraryAddSongIds";
import { songLibrarySubscribe } from "./songLibrarySubscribe";
import { songLibraryUnsubscribe } from "./songLibraryUnsubscribe";
import { songLoadClick } from "./songLoadClick";
import type {
	SongLibraryGridForm,
	SongLibrarySort as SongLibrarySortType,
} from "./types";
import {
	AppSlice,
	sliceResetFns,
	useAppStore,
} from "@/features/app-store/useAppStore";
import { searchTextGet } from "@/features/global/searchTextGet";
import { Song } from "@/features/sections/song/types";

type SongLibrarySliceState = {
	songIds: string[];
	songLibrary: Record<string, Song>;
	songUnsubscribeFns: Record<string, Unsubscribe>;
	songLibrarySort: SongLibrarySortType;
	songLibrarySearch: string;
	songLibraryGridForm: UseFormReturn<SongLibraryGridForm> | null;
};

const songLibrarySliceInitialState: SongLibrarySliceState = {
	songIds: [],
	songLibrary: {},
	songUnsubscribeFns: {},
	songLibrarySort: songLibrarySortDefault,
	songLibrarySearch: "",
	songLibraryGridForm: null,
};

export type SongLibrarySlice = SongLibrarySliceState & {
	songLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songLibrarySubscribe: ReturnType<typeof songLibrarySubscribe>;
	songLibraryUnsubscribe: () => void;
	songLibraryAddSongIds: (songIds: string[]) => void;
	songLibrarySortSet: (sort: SongLibrarySortType) => () => void;
	songLibraryGridFormSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
	songLibraryGridFormSet: (form: UseFormReturn<SongLibraryGridForm>) => void;
	songLibrarySongSet: ({
		songId,
		song,
	}: {
		songId: string;
		song: Song;
	}) => void;
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
		songLibraryGridFormSubmit: songLibraryGridFormSubmit(get, set),
		songLibraryGridFormSet: (form) => set({ songLibraryGridForm: form }),
		songLibrarySongSet: ({ songId, song }) => {
			if (songId) {
				// had to do it this way because otherwise component wouldn't re-render
				set((innerState) => ({
					...innerState,
					songLibrary: {
						...innerState.songLibrary,
						[songId]: song,
					},
				}));
			}
		},
	};
};

export const useSongLibrarySortData = () =>
	useAppStore((state) =>
		state.songLibrarySort
			? songLibrarySortData[state.songLibrarySort]
			: undefined,
	);

export const useSortedFilteredSongIds = () =>
	useAppStore((state) => {
		const search = state.songLibrarySearch.toLowerCase();
		const filteredSongIds = state.songIds.filter((songId) => {
			const song = state.songLibrary[songId];

			if (!song || song.deleted) {
				return false;
			}

			if (
				searchTextGet(song.songName).includes(search) ||
				searchTextGet(song.lyrics).includes(search) ||
				searchTextGet(song.translation).includes(search) ||
				searchTextGet(song.credits).includes(search)
			) {
				return true;
			}

			const songLogs = state.songLogs[songId];

			if (
				songLogs?.some((songLog) =>
					searchTextGet(songLog.notes).includes(search),
				)
			) {
				return true;
			}

			return false;
		});
		const sortData = state.songLibrarySort
			? songLibrarySortData[state.songLibrarySort]
			: undefined;
		if (!sortData) {
			return [];
		}
		return filteredSongIds.sort(sortData.sort(state.songLibrary));
	});
