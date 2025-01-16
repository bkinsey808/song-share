import { Unsubscribe } from "firebase/firestore";
import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { songLoadClick } from "./grid/songLoadClick";
import { songLibraryAddSongIds } from "./songLibraryAddSongIds";
import { songLibrarySubscribe } from "./songLibrarySubscribe";
import { songLibraryUnsubscribe } from "./songLibraryUnsubscribe";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Song } from "@/features/sections/song/types";

type SongLibrarySliceState = {
	songIds: string[];
	songLibrary: Record<string, Song>;
	songUnsubscribeFns: Record<string, Unsubscribe>;
};

const songLibrarySliceInitialState: SongLibrarySliceState = {
	songIds: [],
	songLibrary: {},
	songUnsubscribeFns: {},
};

export type SongLibrarySlice = SongLibrarySliceState & {
	songLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songLibrarySubscribe: ReturnType<typeof songLibrarySubscribe>;
	songLibraryUnsubscribe: () => void;
	songLibraryAddSongIds: (songIds: string[]) => void;
	songLibrarySongSet: ({
		songId,
		song,
	}: {
		songId: string;
		song: Song;
	}) => void;
};

type AppSongLibrarySlice = StateCreator<AppSlice, [], [], SongLibrarySlice>;

export const createSongLibrarySlice: AppSongLibrarySlice = (set, get) => {
	sliceResetFns.add(() => set(songLibrarySliceInitialState));
	return {
		...songLibrarySliceInitialState,
		songLoadClick: songLoadClick(get, set),
		songLibrarySubscribe: songLibrarySubscribe(get, set),
		songLibraryUnsubscribe: songLibraryUnsubscribe(get),
		songLibraryAddSongIds: songLibraryAddSongIds(get, set),
		songLibrarySongSet: ({ songId, song }): void => {
			if (songId) {
				// had to do it this way because otherwise component wouldn't re-render
				set((innerState) => ({
					...innerState,
					songLibrary: {
						...innerState.songLibrary,
						[songId]: song,
					},
				}));
			}
		},
	};
};
