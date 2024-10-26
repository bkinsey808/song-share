import { StateCreator } from "zustand";

import { getDashboardSections } from "../dashboard/getDashboardSectionts";
import { AppSlice, useAppStore } from "@/features/app-store/useAppStore";
import { SectionId } from "@/features/sections/types";

type SectionSliceState = {
	openSections: SectionId[];
};

export const sectionSliceInitialState: SectionSliceState = {
	openSections: [],
};

export type SectionSlice = SectionSliceState & {
	sectionToggle: (
		sectionId: SectionId,
		open?: boolean,
		scrollToElement?: boolean,
	) => void;
	getDashboardSections: () => SectionId[][];
};

type AppSectionSlice = StateCreator<AppSlice, [], [], SectionSlice>;

export const createSectionSlice: AppSectionSlice = (set, get) => ({
	...sectionSliceInitialState,
	getDashboardSections: getDashboardSections(get),
	sectionToggle: (sectionId, open, scrollToElement) => {
		set((state) => {
			const isOpen = state.openSections.includes(sectionId);
			if (open === undefined) {
				if (isOpen) {
					return {
						openSections: state.openSections.filter((id) => id !== sectionId),
					};
				}
				return {
					openSections: [...state.openSections, sectionId],
				};
			}
			if (open && !isOpen) {
				return {
					openSections: [...state.openSections, sectionId],
				};
			}
			if (!open && isOpen) {
				return {
					openSections: state.openSections.filter((id) => id !== sectionId),
				};
			}
			return state;
		});
		if (open && scrollToElement) {
			const el = document.getElementById(sectionId);
			if (el) {
				el.scrollIntoView({ behavior: "smooth" });

				// now account for fixed header
				const scrolledY = window.scrollY;

				if (scrolledY) {
					window.scroll(
						0,
						scrolledY -
							// height of header
							50,
					);
				}
			}
		}
	},
});

// makes it reactive
export const useOpenSection = (sectionId: SectionId) =>
	useAppStore((state) => state.openSections.includes(sectionId));
