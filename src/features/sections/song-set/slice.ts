import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { songSetActiveClick } from "./songSetActiveClick";
import { songSetDeleteClick } from "./songSetDeleteClick";
import { songSetDeleteConfirmClick } from "./songSetDeleteConfirmClick";
import { songSetNewClick } from "./songSetNewClick";
import { songSetSongLoadClick } from "./songSetSongLoadClick";
import { songSetSubmit } from "./songSetSubmit";
import { SongSet } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Nullable } from "@/features/global/types";

export type AppSongSet = Nullable<SongSet>;

type SongSetSliceState = {
	songSetId: string | null;
	activeSongSetId: string | null;
	songSet: AppSongSet | null;
	isSongSetUnsaved: boolean;
	deletingSongSet: boolean;
	songSetForm: UseFormReturn<SongSet> | null;
};

const songSetSliceInitialState: SongSetSliceState = {
	songSetId: null,
	activeSongSetId: null,
	songSet: null,
	isSongSetUnsaved: false,
	deletingSongSet: false,
	songSetForm: null,
};

export type SongSetSlice = SongSetSliceState & {
	songSetSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	songSetNewClick: () => void;
	setIsSongSetUnsaved: (unsavedSongSet: boolean) => void;
	songSetDeleteClick: () => void;
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
	activeSongSetClick: (songSetId: string) => () => Promise<void>;
	setSongSet: (songSet: AppSongSet) => void;
};

type AppSongSetSlice = StateCreator<AppSlice, [], [], SongSetSlice>;

export const createSongSetSlice: AppSongSetSlice = (set, get) => {
	sliceResetFns.add(() => set(songSetSliceInitialState));
	return {
		...songSetSliceInitialState,
		songSetSubmit: songSetSubmit(get, set),
		songSetNewClick: songSetNewClick(get, set),
		isSongSetUnsaved: false,
		setIsSongSetUnsaved: (unsavedSongSet) =>
			set({ isSongSetUnsaved: unsavedSongSet }),
		songSetDeleteClick: songSetDeleteClick(get),
		setSongSetForm: (songSetForm) => set({ songSetForm }),
		songSetDeleteConfirmClick: songSetDeleteConfirmClick(get, set),
		songSetLoadClick: songSetSongLoadClick(get, set),
		songSetSongLoadClick: songSetSongLoadClick(get, set),
		setActiveSongSetId: (activeSongSetId: string | null) =>
			set({ activeSongSetId }),
		activeSongSetClick: songSetActiveClick(get),
		setSongSet: (songSet) => set({ songSet }),
	};
};
