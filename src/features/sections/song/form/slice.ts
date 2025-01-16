import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { playlistSongAddButtonShow } from "../playlistSongAddButtonShow";
import { playlistSongAddClick } from "../playlistSongAddClick";
import { Song } from "../types";
import { songDeleteClick } from "./songDeleteClick";
import { songDeleteConfirmClick } from "./songDeleteConfirmClick";
import { songNewClick } from "./songNewClick";
import { songSubmit } from "./songSubmit";
import { SongForm } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type SongFormSliceState = {
	songUnsavedIs: boolean;
	songDeleting: boolean;
	playlistSongAdding: boolean;
	songForm: UseFormReturn<SongForm> | null;
	songIdToDelete: string | null;
};

type AppSongFormSlice = StateCreator<AppSlice, [], [], SongFormSlice>;

const songFormSliceInitialState: SongFormSliceState = {
	songUnsavedIs: false,
	songDeleting: false,
	playlistSongAdding: false,
	songForm: null,
	songIdToDelete: null,
};

export type SongFormSlice = SongFormSliceState & {
	songSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
	songNewClick: () => void;
	songIsUnsavedSet: (unsavedSong: boolean) => void;
	songDeleteClick: ReturnType<typeof songDeleteClick>;
	songFormSet: (songForm: UseFormReturn<Song>) => void;
	songDeleteConfirmClick: () => Promise<void>;
	playlistSongAddButtonShouldShow: ReturnType<typeof playlistSongAddButtonShow>;
	playlistSongAddClick: ReturnType<typeof playlistSongAddClick>;
	songDefaultGet: () => Song;
};

export const createSongFormSlice: AppSongFormSlice = (set, get) => {
	sliceResetFns.add(() => {
		set(songFormSliceInitialState);
	});
	return {
		...songFormSliceInitialState,
		songSubmit: songSubmit(get, set),
		songNewClick: songNewClick(get, set),
		songIsUnsavedSet: (unsavedSong): void => {
			set({ songUnsavedIs: unsavedSong });
		},
		songDeleteClick: songDeleteClick(get, set),
		songFormSet: (songForm): void => {
			set({ songForm });
		},
		songDeleteConfirmClick: songDeleteConfirmClick(get, set),
		playlistSongAddButtonShouldShow: playlistSongAddButtonShow(get),
		playlistSongAddClick: playlistSongAddClick(get, set),
		songDefaultGet: () => ({
			songName: "",
			lyrics: "",
			translation: "",
			credits: "",
			sharer: get().sessionCookieData?.uid ?? "",
			playlistIds: [],
			songKey: undefined,
			songKeyString: undefined,
		}),
	};
};
