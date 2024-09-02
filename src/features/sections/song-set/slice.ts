import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { songSetLoadClick } from "../song-set-library/songSetLoadClick";
import { songRemoveClick } from "./songRemoveClick";
import { songSetActiveClick } from "./songSetActiveClick";
import { songSetDeleteClick } from "./songSetDeleteClick";
import { songSetDeleteConfirmClick } from "./songSetDeleteConfirmClick";
import { songSetLibraryUnsubscribe } from "./songSetLibraryUnsubscribe";
import { songSetNewClick } from "./songSetNewClick";
import { songSetSubmit } from "./songSetSubmit";
import { SongSet } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Nullable } from "@/features/global/types";

export type AppSongSet = Nullable<SongSet>;

type SongSetSliceState = {
	songSetId: string | null;
	songSetActiveId: string | null;
	songSet: AppSongSet | null;
	isSongSetUnsaved: boolean;
	deletingSongSet: boolean;
	songSetForm: UseFormReturn<SongSet> | null;
	songSetFormIsDisabled: boolean;
};

const songSetSliceInitialState: SongSetSliceState = {
	songSetId: null,
	songSetActiveId: null,
	songSet: null,
	isSongSetUnsaved: false,
	deletingSongSet: false,
	songSetForm: null,
	songSetFormIsDisabled: false,
};

export type SongSetSlice = SongSetSliceState & {
	songSetSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	songSetNewClick: () => void;
	setIsSongSetUnsaved: (unsavedSongSet: boolean) => void;
	songSetDeleteClick: () => void;
	setSongSetForm: (songSetForm: UseFormReturn<SongSet>) => void;
	songSetDeleteConfirmClick: () => Promise<void>;
	songSetActiveClick: (songSetId: string) => () => Promise<void>;
	setSongSet: (songSet: AppSongSet) => void;
	songRemoveClick: ({
		songId,
		songSetId,
	}: {
		songId: string;
		songSetId: string;
	}) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songSetLibraryUnsubscribe: () => void;
	songSetFormDisabledSet: (disabled: boolean) => void;
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
		songSetLoadClick: songSetLoadClick(get, set),
		songSetActiveClick: songSetActiveClick(get, set),
		setSongSet: (songSet) => set({ songSet }),
		songRemoveClick: songRemoveClick(get, set),
		songSetLibraryUnsubscribe: songSetLibraryUnsubscribe(get),
		songSetFormDisabledSet: (disabled) => set({ songFormIsDisabled: disabled }),
	};
};
