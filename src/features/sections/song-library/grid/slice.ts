import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { songLoadClick } from "./songLoadClick";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Song } from "@/features/sections/song/types";

// eslint-disable-next-line @typescript-eslint/ban-types
type SongLibrarySliceState = {};

const songLibrarySliceInitialState: SongLibrarySliceState = {};

export type SongLibraryGridSlice = SongLibrarySliceState & {
	songLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songLibrarySongSet: ({
		songId,
		song,
	}: {
		songId: string;
		song: Song;
	}) => void;
};

type AppSongLibraryGridSlice = StateCreator<
	AppSlice,
	[],
	[],
	SongLibraryGridSlice
>;

export const createSongLibraryGridSlice: AppSongLibraryGridSlice = (
	set,
	get,
) => {
	sliceResetFns.add(() => set(songLibrarySliceInitialState));
	return {
		...songLibrarySliceInitialState,
		songLoadClick: songLoadClick(get, set),
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
