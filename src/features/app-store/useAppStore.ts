import { create } from "zustand";
import { persist } from "zustand/middleware";

import { songLoadClick } from "../sections/song-library/songLoadClick";
import { songSetLoadClick } from "../sections/song-set-library/songSetLoadClick";
import { songSetDeleteClick } from "../sections/song-set/songSetDeleteClick";
import { songSetDeleteConfirmClick } from "../sections/song-set/songSetDeleteConfirmClick";
import { songSetNewClick } from "../sections/song-set/songSetNewClick";
import { songSetSubmit } from "../sections/song-set/songSetSubmit";
import { songDeleteClick } from "../sections/song/songDeleteClick";
import { songDeleteConfirmClick } from "../sections/song/songDeleteConfirmClick";
import { songNewClick } from "../sections/song/songNewClick";
import { songSubmit } from "../sections/song/songSubmit";
import { SectionId } from "./enums";
import { AppSong, AppSongSet, AppStore } from "./types";

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
};

export const useAppStore = create<AppStore>()(
	persist(
		(set, get) => ({
			appModal: null,
			songId: null,
			songSetId: null,
			song,
			songSet,
			songLibrary: {},
			songSetLibrary: {},
			setAppModal: (modal) => set({ appModal: modal }),
			songSubmit: songSubmit(get, set),
			songSetSubmit: songSetSubmit(get, set),
			songNewClick: songNewClick(get, set),
			songSetNewClick: songSetNewClick(get, set),
			openSections: [],
			isSongUnsaved: false,
			isSongSetUnsaved: false,
			setIsSongUnsaved: (unsavedSong) => set({ isSongUnsaved: unsavedSong }),
			setIsSongSetUnsaved: (unsavedSongSet) =>
				set({ isSongSetUnsaved: unsavedSongSet }),
			sectionToggle: (sectionId: SectionId) => {
				set((state) => {
					const isOpen = state.openSections.includes(sectionId);
					return {
						openSections: isOpen
							? state.openSections.filter((id) => id !== sectionId)
							: [...state.openSections, sectionId],
					};
				});
			},
			songLoadClick: songLoadClick(get, set),
			songSetLoadClick: songSetLoadClick(get, set),
			songDeleteClick: songDeleteClick(get),
			songSetDeleteClick: songSetDeleteClick(get),
			deletingSong: false,
			deletingSongSet: false,
			songDeleteConfirmClick: songDeleteConfirmClick(get, set),
			songSetDeleteConfirmClick: songSetDeleteConfirmClick(get, set),
			songForm: null,
			songSetForm: null,
			setSongForm: (songForm) => set({ songForm }),
			setSongSetForm: (songSetForm) => set({ songSetForm }),
		}),
		{
			name: "app-store",
		},
	),
);

// makes it reactive
export const useOpenSection = (sectionId: SectionId) =>
	useAppStore((state) => state.openSections.includes(sectionId));
