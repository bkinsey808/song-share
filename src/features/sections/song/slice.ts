import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { showAddSongToPlaylistButton } from "./showAddSongToPlaylistButton";
import { songActiveClick } from "./songActiveClick";
import { songAddToPlaylistClick } from "./songAddToPlaylistClick";
import { songDeleteClick } from "./songDeleteClick";
import { songDeleteConfirmClick } from "./songDeleteConfirmClick";
import { songNewClick } from "./songNewClick";
import { songSubmit } from "./songSubmit";
import { Song } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Nullable } from "@/features/global/types";

export type AppSong = Nullable<Song>;

type SongSliceState = {
	songActiveId: string | null;
	song: AppSong | null;
	isSongUnsaved: boolean;
	songDeletingIs: boolean;
	addingSongToPlaylist: boolean;
	songId: string | null;
	songForm: UseFormReturn<Song> | null;
};

type AppSongSlice = StateCreator<AppSlice, [], [], SongSlice>;

const songSliceInitialState: SongSliceState = {
	songId: null,
	songActiveId: null,
	songDeletingIs: false,
	songForm: null,
	addingSongToPlaylist: false,
	isSongUnsaved: false,
	song: null,
};

export type SongSlice = SongSliceState & {
	songSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	songNewClick: () => void;
	songIsUnsavedSet: (unsavedSong: boolean) => void;
	songDeleteClick: () => void;
	setSongForm: (songForm: UseFormReturn<Song>) => void;
	songDeleteConfirmClick: () => Promise<void>;
	showAddSongToPlaylistButton: () => boolean;
	addSongToPlaylistClick: () => void;
	songActiveClick: ({
		songId,
		playlistId,
	}: {
		songId: string;
		playlistId?: string | undefined;
	}) => () => Promise<void>;
	setSong: (song: AppSong) => void;
	setSongId: (songId: string | null) => void;
	setActiveSongId: (songId: string | null) => void;
	songNameGet: (songId: string | null) => string | undefined;
};

export const createSongSlice: AppSongSlice = (set, get) => {
	sliceResetFns.add(() => set(songSliceInitialState));
	return {
		...songSliceInitialState,
		songSubmit: songSubmit(get, set),
		songNewClick: songNewClick(get, set),
		songIsUnsavedSet: (unsavedSong) => set({ isSongUnsaved: unsavedSong }),
		songDeleteClick: songDeleteClick(get),
		setSongForm: (songForm) => set({ songForm }),
		songDeleteConfirmClick: songDeleteConfirmClick(get, set),
		showAddSongToPlaylistButton: showAddSongToPlaylistButton(get),
		addSongToPlaylistClick: songAddToPlaylistClick(get, set),
		songActiveClick: songActiveClick(get),
		setSong: (song) => set({ song }),
		setSongId: (songId) => set({ songId }),
		setActiveSongId: (songId) => set({ songActiveId: songId }),
		songNameGet: (songId) => {
			const { songLibrary } = get();
			return songId ? songLibrary[songId]?.songName : undefined;
		},
	};
};
