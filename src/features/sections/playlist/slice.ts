import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { playlistLoadClick } from "../playlist-library/playlistLoadClick";
import { playlistActiveClick } from "./playlistActiveClick";
import { playlistDeleteClick } from "./playlistDeleteClick";
import { playlistDeleteConfirmClick } from "./playlistDeleteConfirmClick";
import { playlistGridFormSubmit } from "./playlistGridFormSubmit";
import { playlistLibraryUnsubscribe } from "./playlistLibraryUnsubscribe";
import { playlistNewClick } from "./playlistNewClick";
import { playlistSubmit } from "./playlistSubmit";
import { Playlist, PlaylistGridForm } from "./types";
import {
	AppSlice,
	sliceResetFns,
	useAppStore,
} from "@/features/app-store/useAppStore";

type PlaylistSliceState = {
	playlistId: string | null;
	playlistActiveId: string | null;
	playlistIsUnsaved: boolean;
	playlistDeletingIs: boolean;
	playlistForm: UseFormReturn<Playlist> | null;
	playlistGridForm: UseFormReturn<PlaylistGridForm> | null;
	playlistFormIsDisabled: boolean;
};

const playlistSliceInitialState: PlaylistSliceState = {
	playlistId: null,
	playlistActiveId: null,
	playlistIsUnsaved: false,
	playlistDeletingIs: false,
	playlistForm: null,
	playlistGridForm: null,
	playlistFormIsDisabled: false,
};

export type PlaylistSlice = PlaylistSliceState & {
	playlistSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	playlistGridFormSubmit: (e?: FormEvent<HTMLFormElement>) => Promise<void>;
	playlistNewClick: () => void;
	playlistIsUnsavedSet: (unsavedPlaylist: boolean) => void;
	playlistDeleteClick: () => void;
	playlistFormSet: (playlistForm: UseFormReturn<Playlist>) => void;
	playlistGridFormSet: (
		playlistGridForm: UseFormReturn<PlaylistGridForm>,
	) => void;
	playlistDeleteConfirmClick: () => Promise<void>;
	playlistActiveClick: (playlistId: string) => () => Promise<void>;
	playlistIdSet: (playlistId: string | null) => void;
	playlistLibraryUnsubscribe: () => void;
	playlistDefaultGet: () => Playlist;
	playlistActiveIdSet: (playlistId: string | null) => void;
};

type AppPlaylistSlice = StateCreator<AppSlice, [], [], PlaylistSlice>;

export const createPlaylistSlice: AppPlaylistSlice = (set, get) => {
	sliceResetFns.add(() => set(playlistSliceInitialState));
	return {
		...playlistSliceInitialState,
		playlistSubmit: playlistSubmit(get, set),
		playlistGridFormSubmit: playlistGridFormSubmit(get, set),
		playlistNewClick: playlistNewClick(get, set),
		playlistIsUnsaved: false,
		playlistIsUnsavedSet: (unsavedPlaylist) => {
			set({ playlistIsUnsaved: unsavedPlaylist });
		},
		playlistDeleteClick: playlistDeleteClick(get),
		playlistFormSet: (playlistForm) => set({ playlistForm }),
		playlistGridFormSet: (playlistGridForm) => {
			set({ playlistGridForm });
		},
		playlistDeleteConfirmClick: playlistDeleteConfirmClick(get, set),
		playlistLoadClick: playlistLoadClick(get, set),
		playlistActiveClick: playlistActiveClick(get, set),
		playlistIdSet: (playlistId) => {
			set({ playlistId });
		},
		playlistLibraryUnsubscribe: playlistLibraryUnsubscribe(get),
		playlistDefaultGet: () => ({
			playlistName: "",
			sharer: get().sessionCookieData?.uid ?? "",
			songs: [],
		}),
		playlistActiveIdSet: (playlistId) => {
			set({ playlistActiveId: playlistId });
		},
	};
};

export const usePlaylist = () =>
	useAppStore((state) =>
		state.playlistId
			? state.playlistLibrary[state.playlistId]
			: state.playlistDefaultGet(),
	);
