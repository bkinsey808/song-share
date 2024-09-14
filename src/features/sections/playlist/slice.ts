import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { playlistLoadClick } from "../playlist-library/playlistLoadClick";
import { playlistActiveClick } from "./playlistActiveClick";
import { playlistDeleteClick } from "./playlistDeleteClick";
import { playlistDeleteConfirmClick } from "./playlistDeleteConfirmClick";
import { playlistLibraryUnsubscribe } from "./playlistLibraryUnsubscribe";
import { playlistNewClick } from "./playlistNewClick";
import { playlistSubmit } from "./playlistSubmit";
import { songRemoveClick } from "./songRemoveClick";
import { Playlist } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Nullable } from "@/features/global/types";

export type AppPlaylist = Nullable<Playlist>;

type PlaylistSliceState = {
	playlistId: string | null;
	playlistActiveId: string | null;
	playlist: AppPlaylist | null;
	isPlaylistUnsaved: boolean;
	deletingPlaylist: boolean;
	playlistForm: UseFormReturn<Playlist> | null;
	playlistFormIsDisabled: boolean;
};

const playlistSliceInitialState: PlaylistSliceState = {
	playlistId: null,
	playlistActiveId: null,
	playlist: null,
	isPlaylistUnsaved: false,
	deletingPlaylist: false,
	playlistForm: null,
	playlistFormIsDisabled: false,
};

export type PlaylistSlice = PlaylistSliceState & {
	playlistSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	playlistNewClick: () => void;
	setIsPlaylistUnsaved: (unsavedPlaylist: boolean) => void;
	playlistDeleteClick: () => void;
	setPlaylistForm: (playlistForm: UseFormReturn<Playlist>) => void;
	playlistDeleteConfirmClick: () => Promise<void>;
	playlistActiveClick: (playlistId: string) => () => Promise<void>;
	setPlaylist: (playlist: AppPlaylist) => void;
	songRemoveClick: ({
		songId,
		playlistId,
	}: {
		songId: string;
		playlistId: string;
	}) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
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
		isPlaylistUnsaved: false,
		setIsPlaylistUnsaved: (unsavedPlaylist) =>
			set({ isPlaylistUnsaved: unsavedPlaylist }),
		playlistDeleteClick: playlistDeleteClick(get),
		setPlaylistForm: (playlistForm) => set({ playlistForm }),
		playlistDeleteConfirmClick: playlistDeleteConfirmClick(get, set),
		playlistLoadClick: playlistLoadClick(get, set),
		playlistActiveClick: playlistActiveClick(get, set),
		setPlaylist: (playlist) => set({ playlist }),
		songRemoveClick: songRemoveClick(get, set),
		playlistLibraryUnsubscribe: playlistLibraryUnsubscribe(get),
		playlistFormDisabledSet: (disabled) =>
			set({ songFormIsDisabled: disabled }),
	};
};
