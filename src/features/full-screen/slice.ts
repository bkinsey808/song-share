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
	fullScreenToggle: (newFullScreenActive?: boolean) => Promise<boolean>;
};

export const createFullScreenSlice: AppFullScreenSlice = (set, get) => {
	sliceResetFns.add(() => set(fullScreenSliceInitialState));
	return {
		...fullScreenSliceInitialState,
		fullScreenToggle: async (active) => {
			const { fullScreenActive } = get();
			const newFullScreenActive = active ?? !fullScreenActive;
			const fullScreenEl = document.fullscreenElement;
			if (!newFullScreenActive || fullScreenEl) {
				await document.exitFullscreen();
			} else {
				await document.documentElement.requestFullscreen();
			}
			set({
				fullScreenActive: newFullScreenActive,
			});
			return newFullScreenActive;
		},
	};
};
