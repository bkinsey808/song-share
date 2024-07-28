import { create } from "zustand";
import { persist } from "zustand/middleware";

import { songDetailsSubmit } from "../sections/song/songDetailsSubmit";
import { SectionId } from "./enums";
import { AppStore } from "./types";

export const useAppStore = create<AppStore>()(
	persist(
		(set, get) => ({
			appModal: null,
			songName: null,
			songId: null,
			translation: null,
			sharer: null,
			credits: null,
			songLibrary: {},
			setAppModal: (modal) => set({ appModal: modal }),
			songDetailsSubmit: songDetailsSubmit(get, set),
			openSections: [],
			toggleSection: (sectionId: SectionId) => {
				set((state) => {
					const isOpen = state.openSections.includes(sectionId);
					return {
						openSections: isOpen
							? state.openSections.filter((id) => id !== sectionId)
							: [...state.openSections, sectionId],
					};
				});
			},
		}),
		{
			name: "app-store",
		},
	),
);

// makes it reactive
export const useOpenSection = (sectionId: SectionId) =>
	useAppStore((state) => state.openSections.includes(sectionId));
