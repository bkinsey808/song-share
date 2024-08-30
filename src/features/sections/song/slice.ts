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
	songActiveId: string | null;
	song: AppSong | null;
	isSongUnsaved: boolean;
	deletingSong: boolean;
	addingSongToSongSet: boolean;
	songId: string | null;
	songForm: UseFormReturn<Song> | null;
	songFormIsDisabled: boolean;
};

type AppSongSlice = StateCreator<AppSlice, [], [], SongSlice>;

const songSliceInitialState: SongSliceState = {
	songId: null,
	songActiveId: null,
	deletingSong: false,
	songForm: null,
	addingSongToSongSet: false,
	isSongUnsaved: false,
	song: null,
	songFormIsDisabled: false,
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
	songActiveClick: ({
		songId,
		songSetId,
	}: {
		songId: string;
		songSetId: string;
	}) => () => Promise<void>;
	setSong: (song: AppSong) => void;
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
		songActiveClick: songActiveClick(get),
		setSong: (song) => set({ song }),
	};
};
