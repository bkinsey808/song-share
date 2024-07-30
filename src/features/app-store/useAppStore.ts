import { create } from "zustand";
import { persist } from "zustand/middleware";

import { songLoadClick } from "../sections/song-library/songLoadClick";
import { songNewClick } from "../sections/song/songNewClick";
import { songSubmit } from "../sections/song/songSubmit";
import { SectionId } from "./enums";
import { AppStore } from "./types";

export const useAppStore = create<AppStore>()(
	persist(
		(set, get) => ({
			appModal: null,
			songId: null,
			songName: null,
			lyrics: null,
			translation: null,
			sharer: null,
			credits: null,
			songLibrary: {},
			setAppModal: (modal) => set({ appModal: modal }),
			songSubmit: songSubmit(get, set),
			songNewClick: songNewClick(set),
			openSections: [],
			isSongUnsaved: false,
			setIsSongUnsaved: (unsavedSong) => set({ isSongUnsaved: unsavedSong }),
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
		}),
		{
			name: "app-store",
		},
	),
);

// makes it reactive
export const useOpenSection = (sectionId: SectionId) =>
	useAppStore((state) => state.openSections.includes(sectionId));
