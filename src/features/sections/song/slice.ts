import { StateCreator } from "zustand";

import { keyMap } from "./consts";
import { songActiveClick } from "./songActiveClick";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type SongSliceState = {
	songActiveId: string | null;
	songId: string | null;
};

type AppSongSlice = StateCreator<AppSlice, [], [], SongSlice>;

const songSliceInitialState: SongSliceState = {
	songId: null,
	songActiveId: null,
};

export type SongSlice = SongSliceState & {
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
	isSharer: (songId: string) => boolean;
};

export const createSongSlice: AppSongSlice = (set, get) => {
	sliceResetFns.add(() => {
		set(songSliceInitialState);
	});
	return {
		...songSliceInitialState,
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
		isSharer: (songId: string): boolean => {
			const { songLibrary, isSignedIn } = get();

			if (!isSignedIn) {
				return false;
			}

			return songLibrary[songId]?.sharer === get().sessionCookieData?.uid;
		},
	};
};
