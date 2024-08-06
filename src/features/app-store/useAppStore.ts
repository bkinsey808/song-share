import { create } from "zustand";
import { persist } from "zustand/middleware";

import { songLoadClick } from "../sections/song-library/songLoadClick";
import { songSetLoadClick } from "../sections/song-set-library/songSetLoadClick";
import { songSetDeleteClick } from "../sections/song-set/songSetDeleteClick";
import { songSetDeleteConfirmClick } from "../sections/song-set/songSetDeleteConfirmClick";
import { songSetNewClick } from "../sections/song-set/songSetNewClick";
import { songSetSongLoadClick } from "../sections/song-set/songSetSongLoadClick";
import { songSetSubmit } from "../sections/song-set/songSetSubmit";
import { songDeleteClick } from "../sections/song/songDeleteClick";
import { songDeleteConfirmClick } from "../sections/song/songDeleteConfirmClick";
import { songNewClick } from "../sections/song/songNewClick";
import { songSubmit } from "../sections/song/songSubmit";
import { AppSong, AppSongSet, AppStore } from "./types";
import { AuthSlice, createAuthSlice } from "@/features/auth/slice";
import { type ModalSlice, createModalSlice } from "@/features/modal/slice";
import { SectionSlice, createSectionSlice } from "@/features/section/slice";

const song: AppSong = {
	songName: null,
	lyrics: null,
	translation: null,
	credits: null,
	sharer: null,
};

const songSet: AppSongSet = {
	songSetName: null,
	sharer: null,
	songSetSongList: [],
	songSetSongs: {},
};

export type AppSlice = ModalSlice & SectionSlice & AuthSlice;

export const useAppStore = create<AppStore>()(
	persist(
		(set, get) => ({
			// song
			songId: null,
			song,
			songSubmit: songSubmit(get, set),
			songNewClick: songNewClick(get, set),
			isSongUnsaved: false,
			setIsSongUnsaved: (unsavedSong) => set({ isSongUnsaved: unsavedSong }),
			songDeleteClick: songDeleteClick(get),
			deletingSong: false,
			songForm: null,
			setSongForm: (songForm) => set({ songForm }),
			songDeleteConfirmClick: songDeleteConfirmClick(get, set),

			// song set
			songSetId: null,
			songSet,
			songSetSubmit: songSetSubmit(get, set),
			songSetNewClick: songSetNewClick(get, set),
			isSongSetUnsaved: false,
			setIsSongSetUnsaved: (unsavedSongSet) =>
				set({ isSongSetUnsaved: unsavedSongSet }),
			songSetSongLoadClick: songSetSongLoadClick(get, set),
			songSetDeleteClick: songSetDeleteClick(get),
			deletingSongSet: false,
			songSetForm: null,
			setSongSetForm: (songSetForm) => set({ songSetForm }),
			songSetDeleteConfirmClick: songSetDeleteConfirmClick(get, set),

			// song library
			songLibrary: {},
			songLoadClick: songLoadClick(get, set),

			// song set library
			songSetLibrary: {},
			songSetLoadClick: songSetLoadClick(get, set),
		}),
		{
			name: "app-store",
		},
	),
);

export const useAppSliceStore = create<AppSlice>()(
	persist(
		(...a) => ({
			...createModalSlice(...a),
			...createSectionSlice(...a),
			...createAuthSlice(...a),
		}),
		{
			name: "app-slice-store",
		},
	),
);
