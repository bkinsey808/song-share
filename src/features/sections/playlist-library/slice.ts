import { Unsubscribe } from "firebase/firestore";
import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { playlistLibraryUpdate } from "../song/playlistLibraryUpdate";
import { playlistLibraryAddPlaylistIds } from "./playlistLibraryAddPlaylistIds";
import { playlistLoadClick } from "./playlistLoadClick";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { Playlist } from "@/features/sections/playlist/types";

type PlaylistLibrarySliceState = {
	playlistIds: string[];
	playlistLibrary: Record<string, Playlist>;
	playlistUnsubscribeFns: Record<string, Unsubscribe>;
};

const playlistLibrarySliceInitialState: PlaylistLibrarySliceState = {
	playlistIds: [],
	playlistLibrary: {},
	playlistUnsubscribeFns: {},
};

export type PlaylistLibrarySlice = PlaylistLibrarySliceState & {
	playlistLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	playlistLibraryUpdate: () => void;
	playlistLibraryAddPlaylistIds: (playlistIds: string[]) => void;
};

type AppSongLibrarySlice = StateCreator<AppSlice, [], [], PlaylistLibrarySlice>;

export const createPlaylistLibrarySlice: AppSongLibrarySlice = (set, get) => {
	sliceResetFns.add(() => set(playlistLibrarySliceInitialState));
	return {
		...playlistLibrarySliceInitialState,
		playlistLoadClick: playlistLoadClick(get, set),
		playlistLibraryUpdate: playlistLibraryUpdate(get, set),
		playlistLibraryAddPlaylistIds: playlistLibraryAddPlaylistIds(get, set),
	};
};
