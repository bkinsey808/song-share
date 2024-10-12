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
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Nullable } from "@/features/global/types";

export type AppSong = Nullable<Song>;

type SongSliceState = {
	songActiveId: string | null;
	song: AppSong | null;
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
	song: null,
};

export type SongSlice = SongSliceState & {
	songSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
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
	songSet: (song: AppSong) => void;
	songIdSet: (songId: string | null) => void;
	songActiveIdSet: (songId: string | null) => void;
	songNameGet: (songId: string | null) => string | undefined;
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
		songSet: (song) => set({ song }),
		songIdSet: (songId) => set({ songId }),
		songActiveIdSet: (songId) => set({ songActiveId: songId }),
		songNameGet: (songId) => {
			const { songLibrary } = get();
			return songId ? songLibrary[songId]?.songName : undefined;
		},
	};
};
