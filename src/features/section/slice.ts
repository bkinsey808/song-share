import { StateCreator } from "zustand";

import { AppSlice, useAppStore } from "@/features/app-store/useAppStore";
import { SectionId } from "@/features/sections/types";

type SectionSliceState = {
	openSections: SectionId[];
};

export const sectionSliceInitialState: SectionSliceState = {
	openSections: [],
};

export type SectionSlice = SectionSliceState & {
	sectionToggle: (sectionId: SectionId) => void;
};

type AppSectionSlice = StateCreator<AppSlice, [], [], SectionSlice>;

export const createSectionSlice: AppSectionSlice = (set, _get) => ({
	...sectionSliceInitialState,
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
});

// makes it reactive
export const useOpenSection = (sectionId: SectionId) =>
	useAppStore((state) => state.openSections.includes(sectionId));
