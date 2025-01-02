import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { keyMap } from "./consts";
import { playlistSongAddButtonShow } from "./playlistSongAddButtonShow";
import { playlistSongAddClick } from "./playlistSongAddClick";
import { songActiveClick } from "./songActiveClick";
import { songDeleteClick } from "./songDeleteClick";
import { songDeleteConfirmClick } from "./songDeleteConfirmClick";
import { songNewClick } from "./songNewClick";
import { songSubmit } from "./songSubmit";
import { Song, SongForm } from "./types";
import {
	AppSlice,
	sliceResetFns,
	useAppStore,
} from "@/features/app-store/useAppStore";

type SongSliceState = {
	songActiveId: string | null;
	songUnsavedIs: boolean;
	songDeleting: boolean;
	playlistSongAdding: boolean;
	songId: string | null;
	songForm: UseFormReturn<SongForm> | null;
	songIdToDelete: string | null;
};

type AppSongSlice = StateCreator<AppSlice, [], [], SongSlice>;

const songSliceInitialState: SongSliceState = {
	songId: null,
	songActiveId: null,
	songDeleting: false,
	songForm: null,
	playlistSongAdding: false,
	songUnsavedIs: false,
	songIdToDelete: null,
};

export type SongSlice = SongSliceState & {
	songSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
	songNewClick: () => void;
	songIsUnsavedSet: (unsavedSong: boolean) => void;
	songDeleteClick: ReturnType<typeof songDeleteClick>;
	songFormSet: (songForm: UseFormReturn<Song>) => void;
	songDeleteConfirmClick: () => Promise<void>;
	playlistSongAddButtonShouldShow: ReturnType<typeof playlistSongAddButtonShow>;
	playlistSongAddClick: ReturnType<typeof playlistSongAddClick>;
	songActiveClick: ({
		songId,
		playlistId,
	}: {
		songId: string;
		playlistId?: string | undefined;
	}) => () => Promise<void>;
	songIdSet: (songId: string | null) => void;
	songActiveIdSet: (songId: string | null) => void;
	songNameGet: (songId: string | null) => string | undefined;
	songKeyGet: (songId: string | null) => string | undefined;
	songDefaultGet: () => Song;
	isSharer: (songId: string) => boolean;
};

export const createSongSlice: AppSongSlice = (set, get) => {
	sliceResetFns.add(() => {
		set(songSliceInitialState);
	});
	return {
		...songSliceInitialState,
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
		songActiveClick: songActiveClick(get),
		songIdSet: (songId): void => {
			set({ songId });
		},
		songActiveIdSet: (songId): void => {
			set({ songActiveId: songId });
		},
		songNameGet: (songId): string | undefined => {
			const { songLibrary } = get();
			return songId ? songLibrary[songId]?.songName : undefined;
		},
		songKeyGet: (songId): string | undefined => {
			const { songLibrary } = get();
			const songKey = songId ? songLibrary[songId]?.songKey : undefined;
			return songKey !== undefined ? keyMap.get(songKey) : undefined;
		},
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
		isSharer: (songId: string): boolean => {
			const { songLibrary, isSignedIn } = get();

			if (!isSignedIn) {
				return false;
			}

			return songLibrary[songId]?.sharer === get().sessionCookieData?.uid;
		},
	};
};

export const useSong = (): Song =>
	useAppStore((state) =>
		state.songId ? state.songLibrary[state.songId] : state.songDefaultGet(),
	);
