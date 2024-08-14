import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { activeSongClick } from "./activeSongClick";
import { addSongToSongSetClick } from "./addSongToSongSetClick";
import { showAddSongToSongSetButton } from "./showAddSongToSongSetButton";
import { songDeleteClick } from "./songDeleteClick";
import { songDeleteConfirmClick } from "./songDeleteConfirmClick";
import { songNewClick } from "./songNewClick";
import { songSubmit } from "./songSubmit";
import { Song } from "./types";
import { AppSlice } from "@/features/app-store/useAppStore";
import { Nullable } from "@/features/global/types";

export type AppSong = Nullable<Song>;

export type SongSlice = {
	songId: string | null;
	activeSongId: string | null;
	song: AppSong;
	songSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	songNewClick: () => void;
	isSongUnsaved: boolean;
	setIsSongUnsaved: (unsavedSong: boolean) => void;
	songDeleteClick: () => void;
	deletingSong: boolean;
	songForm: UseFormReturn<Song> | null;
	setSongForm: (songForm: UseFormReturn<Song>) => void;
	songDeleteConfirmClick: () => Promise<void>;
	showAddSongToSongSetButton: () => boolean;
	addingSongToSongSet: boolean;
	addSongToSongSetClick: () => Promise<void>;
	setActiveSongId: (activeSongId: string | null) => void;
	activeSongClick: (songId: string) => () => Promise<void>;
};

type AppSongSlice = StateCreator<AppSlice, [], [], SongSlice>;

const song: AppSong = {
	songName: null,
	lyrics: null,
	translation: null,
	credits: null,
	sharer: null,
};

export const createSongSlice: AppSongSlice = (set, get) => ({
	songId: null,
	activeSongId: null,
	song,
	songSubmit: songSubmit(get, set),
	songNewClick: songNewClick(get, set),
	isSongUnsaved: false,
	setIsSongUnsaved: (unsavedSong) => set({ isSongUnsaved: unsavedSong }),
	songDeleteClick: songDeleteClick(get),
	deletingSong: false,
	songForm: null,
	setSongForm: (songForm) => set({ songForm }),
	songDeleteConfirmClick: songDeleteConfirmClick(get, set),
	showAddSongToSongSetButton: showAddSongToSongSetButton(get),
	addingSongToSongSet: false,
	addSongToSongSetClick: addSongToSongSetClick(get, set),
	setActiveSongId: (activeSongId: string | null) => set({ activeSongId }),
	activeSongClick: activeSongClick(get),
});
