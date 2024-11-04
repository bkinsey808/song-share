import { isFirefox, isMobile } from "react-device-detect";
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
				if (isMobile || isFirefox) {
					/** the distance from the outer border of the element (including its margin) to the top padding edge of the offsetParent, the closest positioned ancestor element */
					const y = el.offsetTop;

					// scroll to element y
					window.scrollTo({
						top: y - 40, // header height
						behavior: "smooth",
					});
				} else {
					// use scrollIntoView for mobile
					el.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});

					const scrolledY = window.scrollY;

					if (scrolledY) {
						window.scroll(0, scrolledY - 40);
					}
				}
			}
		}
	},
});

// makes it reactive
export const useOpenSection = (sectionId: SectionId) =>
	useAppStore((state) => state.openSections.includes(sectionId));
