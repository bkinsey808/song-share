import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { Song } from "../song/types";
import { songLoadClick } from "./songLoadClick";
import { AppSlice } from "@/features/app-store/useAppStore";

export type SongLibrarySlice = {
	songLibrary: Record<string, Song>;
	songLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
};

type AppSongLibrarySlice = StateCreator<AppSlice, [], [], SongLibrarySlice>;

export const createSongLibrarySlice: AppSongLibrarySlice = (set, get) => ({
	songLibrary: {},
	songLoadClick: songLoadClick(get, set),
});
