import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { SongSet } from "../song-set/types";
import { songSetLoadClick } from "./songSetLoadClick";
import { AppSlice } from "@/features/app-store/useAppStore";

export type SongSetLibrarySlice = {
	songSetLibrary: Record<string, SongSet>;
	songSetLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
};

type AppSongLibrarySlice = StateCreator<AppSlice, [], [], SongSetLibrarySlice>;

export const createSongSetLibrarySlice: AppSongLibrarySlice = (set, get) => ({
	songSetLibrary: {},
	songSetLoadClick: songSetLoadClick(get, set),
});
