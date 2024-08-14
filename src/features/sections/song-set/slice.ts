import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { songSetDeleteClick } from "./songSetDeleteClick";
import { songSetDeleteConfirmClick } from "./songSetDeleteConfirmClick";
import { songSetNewClick } from "./songSetNewClick";
import { songSetSongLoadClick } from "./songSetSongLoadClick";
import { songSetSubmit } from "./songSetSubmit";
import { SongSet } from "./types";
import { AppSlice } from "@/features/app-store/useAppStore";
import { Nullable } from "@/features/global/types";

export type AppSongSet = Nullable<SongSet>;

export type SongSetSlice = {
	songSetId: string | null;
	activeSongSetId: string | null;
	songSet: AppSongSet;
	songSetSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	songSetNewClick: () => void;
	isSongSetUnsaved: boolean;
	setIsSongSetUnsaved: (unsavedSongSet: boolean) => void;
	songSetDeleteClick: () => void;
	deletingSongSet: boolean;
	songSetForm: UseFormReturn<SongSet> | null;
	setSongSetForm: (songSetForm: UseFormReturn<SongSet>) => void;
	songSetDeleteConfirmClick: () => Promise<void>;
	songSetSongLoadClick: ({
		songId,
		songSetId,
	}: {
		songId: string;
		songSetId: string | null;
	}) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	setActiveSongSetId: (activeSongSetId: string | null) => void;
};

type AppSongSetSlice = StateCreator<AppSlice, [], [], SongSetSlice>;

const songSet: AppSongSet = {
	songSetName: null,
	sharer: null,
	songSetSongList: [],
	songSetSongs: {},
};

export const createSongSetSlice: AppSongSetSlice = (set, get) => ({
	songSetId: null,
	activeSongSetId: null,
	songSet,
	songSetSubmit: songSetSubmit(get, set),
	songSetNewClick: songSetNewClick(get, set),
	isSongSetUnsaved: false,
	setIsSongSetUnsaved: (unsavedSongSet) =>
		set({ isSongSetUnsaved: unsavedSongSet }),
	songSetDeleteClick: songSetDeleteClick(get),
	deletingSongSet: false,
	songSetForm: null,
	setSongSetForm: (songSetForm) => set({ songSetForm }),
	songSetDeleteConfirmClick: songSetDeleteConfirmClick(get, set),
	songSetLoadClick: songSetSongLoadClick(get, set),
	songSetSongLoadClick: songSetSongLoadClick(get, set),
	setActiveSongSetId: (activeSongSetId: string | null) =>
		set({ activeSongSetId }),
});
