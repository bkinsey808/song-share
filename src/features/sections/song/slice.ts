import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { showAddSongToSongSetButton } from "./showAddSongToSongSetButton";
import { songActiveClick } from "./songActiveClick";
import { songAddToSongSetClick } from "./songAddToSongSetClick";
import { songDeleteClick } from "./songDeleteClick";
import { songDeleteConfirmClick } from "./songDeleteConfirmClick";
import { songNewClick } from "./songNewClick";
import { songSubmit } from "./songSubmit";
import { Song } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Nullable } from "@/features/global/types";

export type AppSong = Nullable<Song>;

type SongSliceState = {
	activeSongId: string | null;
	song: AppSong;
	isSongUnsaved: boolean;
	deletingSong: boolean;
	addingSongToSongSet: boolean;
	songId: string | null;
	songForm: UseFormReturn<Song> | null;
};

type AppSongSlice = StateCreator<AppSlice, [], [], SongSlice>;

const song: AppSong = {
	songName: null,
	lyrics: null,
	translation: null,
	credits: null,
	sharer: null,
};

const songSliceInitialState: SongSliceState = {
	songId: null,
	activeSongId: null,
	deletingSong: false,
	songForm: null,
	addingSongToSongSet: false,
	isSongUnsaved: false,
	song,
};

export type SongSlice = SongSliceState & {
	songSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	songNewClick: () => void;
	setIsSongUnsaved: (unsavedSong: boolean) => void;
	songDeleteClick: () => void;
	setSongForm: (songForm: UseFormReturn<Song>) => void;
	songDeleteConfirmClick: () => Promise<void>;
	showAddSongToSongSetButton: () => boolean;
	addSongToSongSetClick: () => Promise<void>;
	setActiveSongId: (activeSongId: string | null) => void;
	activeSongClick: (songId: string) => () => Promise<void>;
};

export const createSongSlice: AppSongSlice = (set, get) => {
	sliceResetFns.add(() => set(songSliceInitialState));
	return {
		...songSliceInitialState,
		songSubmit: songSubmit(get, set),
		songNewClick: songNewClick(get, set),
		setIsSongUnsaved: (unsavedSong) => set({ isSongUnsaved: unsavedSong }),
		songDeleteClick: songDeleteClick(get),
		setSongForm: (songForm) => set({ songForm }),
		songDeleteConfirmClick: songDeleteConfirmClick(get, set),
		showAddSongToSongSetButton: showAddSongToSongSetButton(get),
		addSongToSongSetClick: songAddToSongSetClick(get, set),
		setActiveSongId: (activeSongId: string | null) => set({ activeSongId }),
		activeSongClick: songActiveClick(get),
	};
};
