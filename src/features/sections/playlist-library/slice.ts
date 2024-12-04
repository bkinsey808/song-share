import { Unsubscribe } from "firebase/firestore";
import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { playlistLibrarySubscribe } from "../song/playlistLibrarySubscribe";
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
	playlistLoadClick: ReturnType<typeof playlistLoadClick>;
	playlistLibrarySubscribe: ReturnType<typeof playlistLibrarySubscribe>;
	playlistLibraryAddPlaylistIds: ReturnType<
		typeof playlistLibraryAddPlaylistIds
	>;
};

type AppSongLibrarySlice = StateCreator<AppSlice, [], [], PlaylistLibrarySlice>;

export const createPlaylistLibrarySlice: AppSongLibrarySlice = (set, get) => {
	sliceResetFns.add(() => set(playlistLibrarySliceInitialState));
	return {
		...playlistLibrarySliceInitialState,
		playlistLoadClick: playlistLoadClick(get, set),
		playlistLibrarySubscribe: playlistLibrarySubscribe(get, set),
		playlistLibraryAddPlaylistIds: playlistLibraryAddPlaylistIds(get, set),
	};
};
