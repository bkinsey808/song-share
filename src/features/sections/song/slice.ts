import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { playlistSongAddButtonShow } from "./playlistSongAddButtonShow";
import { playlistSongAddClick } from "./playlistSongAddClick";
import { songActiveClick } from "./songActiveClick";
import { songDeleteClick } from "./songDeleteClick";
import { songDeleteConfirmClick } from "./songDeleteConfirmClick";
import { songNewClick } from "./songNewClick";
import { songSubmit } from "./songSubmit";
import { Song } from "./types";
import {
	AppSlice,
	sliceResetFns,
	useAppStore,
} from "@/features/app-store/useAppStore";

type SongSliceState = {
	songActiveId: string | null;
	songUnsavedIs: boolean;
	songDeleting: boolean;
	playlistSongAdding: boolean;
	songId: string | null;
	songForm: UseFormReturn<Song> | null;
};

type AppSongSlice = StateCreator<AppSlice, [], [], SongSlice>;

const songSliceInitialState: SongSliceState = {
	songId: null,
	songActiveId: null,
	songDeleting: false,
	songForm: null,
	playlistSongAdding: false,
	songUnsavedIs: false,
};

export type SongSlice = SongSliceState & {
	songSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
	songNewClick: () => void;
	songIsUnsavedSet: (unsavedSong: boolean) => void;
	songDeleteClick: () => void;
	songFormSet: (songForm: UseFormReturn<Song>) => void;
	songDeleteConfirmClick: () => Promise<void>;
	playlistSongAddButtonShouldShow: () => boolean;
	playlistSongAddClick: () => void;
	songActiveClick: ({
		songId,
		playlistId,
	}: {
		songId: string;
		playlistId?: string | undefined;
	}) => () => Promise<void>;
	songIdSet: (songId: string | null) => void;
	songActiveIdSet: (songId: string | null) => void;
	songNameGet: (songId: string | null) => string | undefined;
	songDefaultGet: () => Song;
};

export const createSongSlice: AppSongSlice = (set, get) => {
	sliceResetFns.add(() => set(songSliceInitialState));
	return {
		...songSliceInitialState,
		songSubmit: songSubmit(get, set),
		songNewClick: songNewClick(get, set),
		songIsUnsavedSet: (unsavedSong) => set({ songUnsavedIs: unsavedSong }),
		songDeleteClick: songDeleteClick(get),
		songFormSet: (songForm) => set({ songForm }),
		songDeleteConfirmClick: songDeleteConfirmClick(get, set),
		playlistSongAddButtonShouldShow: playlistSongAddButtonShow(get),
		playlistSongAddClick: playlistSongAddClick(get, set),
		songActiveClick: songActiveClick(get),
		songIdSet: (songId) => set({ songId }),
		songActiveIdSet: (songId) => set({ songActiveId: songId }),
		songNameGet: (songId) => {
			const { songLibrary } = get();
			return songId ? songLibrary[songId]?.songName : undefined;
		},
		songDefaultGet: () => ({
			songName: "",
			lyrics: "",
			translation: "",
			credits: "",
			sharer: get().sessionCookieData?.uid ?? "",
			playlistIds: [],
		}),
	};
};

export const useSong = () =>
	useAppStore((state) =>
		state.songId ? state.songLibrary[state.songId] : state.songDefaultGet(),
	);
