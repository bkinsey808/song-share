import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { songLogDeleteClick } from "../song-log/songLogDeleteClick";
import { songLogDeleteConfirmClick } from "../song-log/songLogDeleteConfirmClick";
import { songLogLoadClick } from "../song-log/songLogLoadClick";
import { songLogNewClick } from "../song-log/songLogNewClick";
import { songLogSubmit } from "../song-log/songLogSubmit";
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
import { LogForm } from "@/features/sections/log/types";

export type AppSong = Nullable<Song>;

type SongSliceState = {
	songActiveId: string | null;
	song: AppSong | null;
	songUnsavedIs: boolean;
	songDeleting: boolean;
	playlistSongAdding: boolean;
	songId: string | null;
	songForm: UseFormReturn<Song> | null;
	songLogForm: UseFormReturn<LogForm> | null;
	songLogId: string | null;
	songLogDeleting: boolean;
};

type AppSongSlice = StateCreator<AppSlice, [], [], SongSlice>;

const songSliceInitialState: SongSliceState = {
	songId: null,
	songActiveId: null,
	songDeleting: false,
	songForm: null,
	songLogForm: null,
	playlistSongAdding: false,
	songUnsavedIs: false,
	song: null,
	songLogId: null,
	songLogDeleting: false,
};

export type SongSlice = SongSliceState & {
	songSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	songLogSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	songNewClick: () => void;
	songLogNewClick: () => void;
	songLogDeleteClick: () => void;
	songLogDeleteConfirmClick: () => Promise<void>;
	songIsUnsavedSet: (unsavedSong: boolean) => void;
	songDeleteClick: () => void;
	songFormSet: (songForm: UseFormReturn<Song>) => void;
	songLogFormSet: (songLogForm: UseFormReturn<LogForm>) => void;
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
	songLogLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
};

export const createSongSlice: AppSongSlice = (set, get) => {
	sliceResetFns.add(() => set(songSliceInitialState));
	return {
		...songSliceInitialState,
		songSubmit: songSubmit(get, set),
		songLogSubmit: songLogSubmit(get, set),
		songNewClick: songNewClick(get, set),
		songLogNewClick: songLogNewClick(get, set),
		songIsUnsavedSet: (unsavedSong) => set({ songUnsavedIs: unsavedSong }),
		songDeleteClick: songDeleteClick(get),
		songFormSet: (songForm) => set({ songForm }),
		songLogFormSet: (songLogForm) => set({ songLogForm }),
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
		songLogLoadClick: songLogLoadClick(get, set),
		songLogDeleteClick: songLogDeleteClick(get),
		songLogDeleteConfirmClick: songLogDeleteConfirmClick(get, set),
	};
};
