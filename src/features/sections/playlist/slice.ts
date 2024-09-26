import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { playlistLoadClick } from "../playlist-library/playlistLoadClick";
import { playlistActiveClick } from "./playlistActiveClick";
import { playlistDeleteClick } from "./playlistDeleteClick";
import { playlistDeleteConfirmClick } from "./playlistDeleteConfirmClick";
import { playlistLibraryUnsubscribe } from "./playlistLibraryUnsubscribe";
import { playlistNewClick } from "./playlistNewClick";
import { playlistSubmit } from "./playlistSubmit";
import { Playlist } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Nullable } from "@/features/global/types";

export type AppPlaylist = Nullable<Playlist>;

type PlaylistSliceState = {
	playlistId: string | null;
	playlistActiveId: string | null;
	playlist: AppPlaylist | null;
	playlistIsUnsaved: boolean;
	deletingPlaylist: boolean;
	playlistForm: UseFormReturn<Playlist> | null;
	playlistFormIsDisabled: boolean;
};

const playlistSliceInitialState: PlaylistSliceState = {
	playlistId: null,
	playlistActiveId: null,
	playlist: null,
	playlistIsUnsaved: false,
	deletingPlaylist: false,
	playlistForm: null,
	playlistFormIsDisabled: false,
};

export type PlaylistSlice = PlaylistSliceState & {
	playlistSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	playlistNewClick: () => void;
	playlistIsUnsavedSet: (unsavedPlaylist: boolean) => void;
	playlistDeleteClick: () => void;
	playlistFormSet: (playlistForm: UseFormReturn<Playlist>) => void;
	playlistDeleteConfirmClick: () => Promise<void>;
	playlistActiveClick: (playlistId: string) => () => Promise<void>;
	playlistSet: (playlist: AppPlaylist) => void;
	playlistIdSet: (playlistId: string | null) => void;
	playlistLibraryUnsubscribe: () => void;
	playlistFormDisabledSet: (disabled: boolean) => void;
};

type AppPlaylistSlice = StateCreator<AppSlice, [], [], PlaylistSlice>;

export const createPlaylistSlice: AppPlaylistSlice = (set, get) => {
	sliceResetFns.add(() => set(playlistSliceInitialState));
	return {
		...playlistSliceInitialState,
		playlistSubmit: playlistSubmit(get, set),
		playlistNewClick: playlistNewClick(get, set),
		playlistIsUnsaved: false,
		playlistIsUnsavedSet: (unsavedPlaylist) =>
			set({ playlistIsUnsaved: unsavedPlaylist }),
		playlistDeleteClick: playlistDeleteClick(get),
		playlistFormSet: (playlistForm) => set({ playlistForm }),
		playlistDeleteConfirmClick: playlistDeleteConfirmClick(get, set),
		playlistLoadClick: playlistLoadClick(get, set),
		playlistActiveClick: playlistActiveClick(get, set),
		playlistSet: (playlist) => set({ playlist }),
		playlistIdSet: (playlistId) => set({ playlistId }),
		playlistLibraryUnsubscribe: playlistLibraryUnsubscribe(get),
		playlistFormDisabledSet: (disabled) =>
			set({ songFormIsDisabled: disabled }),
	};
};
