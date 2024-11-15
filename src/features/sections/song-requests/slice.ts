import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { songRequestsSortData, songRequestsSortDefault } from "./consts";
import { songRequestAddClick } from "./songRequestAddClick";
import { songRequestRemoveClick } from "./songRequestRemoveClick";
import { songRequestsGridFormSubmit } from "./songRequestsGridFormSubmit";
import { songRequestsRemoveAllClick } from "./songRequestsRemoveAllClick";
import { SongRequests, SongRequestsGridForm, SongRequestsSort } from "./types";
import {
	AppSlice,
	sliceResetFns,
	useAppStore,
} from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";
import { searchTextGet } from "@/features/global/searchTextGet";

type SongRequestsSliceState = {
	songRequests: SongRequests;
	songRequestPending: boolean;
	songRequestsSort: SongRequestsSort;
	songRequestsSearch: string;
	songRequestsGridForm: UseFormReturn<SongRequestsGridForm> | null;
};

const songRequestsSliceInitialState: SongRequestsSliceState = {
	songRequests: {},
	songRequestPending: false,
	songRequestsSort: songRequestsSortDefault,
	songRequestsSearch: "",
	songRequestsGridForm: null,
};

export type SongRequestsSlice = SongRequestsSliceState & {
	songRequestAddClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songRequestRemoveClick: ({
		songId,
		userId,
	}: {
		songId: string;
		userId?: string;
	}) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songRequestsSortSet: (sort: SongRequestsSort) => () => void;
	songRequestsGridFormSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
	songRequestsGridFormSet: (form: UseFormReturn<SongRequestsGridForm>) => void;
	songRequestAdded: (songId: string) => boolean;
	songRequestsSet: (songRequests: SongRequests) => void;
	songRequestsRemoveAllClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
};

type AppSongRequestsSlice = StateCreator<AppSlice, [], [], SongRequestsSlice>;

export const createSongRequestsSlice: AppSongRequestsSlice = (set, get) => {
	sliceResetFns.add(() => set(songRequestsSliceInitialState));
	return {
		...songRequestsSliceInitialState,
		songRequestAddClick: songRequestAddClick(set, get),
		songRequestRemoveClick: songRequestRemoveClick(set, get),
		songRequestsSortSet: (sort) => () => {
			set({
				songRequestsSort: sort,
			});
		},
		songRequestsGridFormSubmit: songRequestsGridFormSubmit(get, set),
		songRequestsGridFormSet: (form) => set({ songRequestsGridForm: form }),
		songRequestAdded: (songId) => {
			const { sessionCookieData, songRequests } = get();

			return sessionCookieData?.uid
				? (songRequests?.[songId]?.includes(sessionCookieData?.uid) ?? false)
				: false;
		},
		songRequestsSet: (songRequests) => {
			set({ songRequests });
		},
		songRequestsRemoveAllClick: songRequestsRemoveAllClick(set, get),
	};
};

export const useSortedFilteredSongRequestSongIds = () =>
	useAppStore((state) => {
		const search = state.songRequestsSearch.toLowerCase();
		const filteredSongIds = getKeys(state?.songRequests ?? {}).filter(
			(songId) => {
				const song = state.songLibrary[songId];

				if (!song) {
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
			},
		);
		const sortData = state.songRequestsSort
			? songRequestsSortData[state.songRequestsSort]
			: undefined;
		if (!sortData) {
			return [];
		}
		return filteredSongIds.sort(sortData.sort(state.songLibrary));
	});
