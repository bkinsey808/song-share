import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

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
});
