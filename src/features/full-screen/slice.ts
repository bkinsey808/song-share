import { StateCreator } from "zustand";

import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type FullScreenSliceState = {
	fullScreenActive: boolean;
};

type AppFullScreenSlice = StateCreator<AppSlice, [], [], FullScreenSlice>;

const fullScreenSliceInitialState: FullScreenSliceState = {
	fullScreenActive: false,
};

export type FullScreenSlice = FullScreenSliceState & {
	fullScreenToggle: (newFullScreenActive?: boolean) => boolean;
};

export const createFullScreenSlice: AppFullScreenSlice = (set, get) => {
	sliceResetFns.add(() => set(fullScreenSliceInitialState));
	return {
		...fullScreenSliceInitialState,
		fullScreenToggle: (active) => {
			const { fullScreenActive } = get();
			const newFullScreenActive = active ?? !fullScreenActive;
			const fullScreenEl = document.fullscreenElement;
			if (!newFullScreenActive || fullScreenEl) {
				document.exitFullscreen();
			} else {
				document.documentElement.requestFullscreen();
			}
			set({
				fullScreenActive: newFullScreenActive,
			});
			return newFullScreenActive;
		},
	};
};
