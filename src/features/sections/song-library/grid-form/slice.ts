import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { songLibrarySortDefault } from "./consts";
import { resetOnClick } from "./resetOnClick";
import { submit } from "./submit";
import type {
	SongLibraryGridForm,
	SongLibrarySort as SongLibrarySortType,
} from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type SongLibraryGridFormSliceState = {
	songLibrarySort: SongLibrarySortType;
	songLibrarySearch: string;
	songLibraryGridForm: UseFormReturn<SongLibraryGridForm> | null;
};

const songLibrarySliceInitialState: SongLibraryGridFormSliceState = {
	songLibrarySort: songLibrarySortDefault,
	songLibrarySearch: "",
	songLibraryGridForm: null,
};

export type SongLibraryGridFormSlice = SongLibraryGridFormSliceState & {
	songLibrarySortSet: (sort: SongLibrarySortType) => () => void;
	songLibraryGridFormSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
	songLibraryGridFormSet: (form: UseFormReturn<SongLibraryGridForm>) => void;
	songLibraryGridFormResetOnClick: () => void;
};

type AppSongLibrarySlice = StateCreator<
	AppSlice,
	[],
	[],
	SongLibraryGridFormSlice
>;

const songLibraryGridFormSliceInitialState: SongLibraryGridFormSliceState = {
	songLibrarySort: songLibrarySortDefault,
	songLibrarySearch: "",
	songLibraryGridForm: null,
};

export const createSongLibraryGridFormSlice: AppSongLibrarySlice = (
	set,
	get,
) => {
	sliceResetFns.add(() => set(songLibrarySliceInitialState));
	return {
		...songLibraryGridFormSliceInitialState,
		songLibrarySortSet: (sort) => () => {
			set({
				songLibrarySort: sort,
			});
		},
		songLibraryGridFormSubmit: submit(get, set),
		songLibraryGridFormSet: (form) => set({ songLibraryGridForm: form }),
		songLibraryGridFormResetOnClick: resetOnClick(get),
	};
};
