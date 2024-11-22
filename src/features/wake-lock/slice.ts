import { StateCreator } from "zustand";

import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type WakeLockSliceState = {
	wakeLockActive: boolean;
	wakeLockSentinel: WakeLockSentinel | null;
};

type AppWakeLockSlice = StateCreator<AppSlice, [], [], WakeLockSlice>;

const settingsSliceInitialState: WakeLockSliceState = {
	wakeLockActive: false,
	wakeLockSentinel: null,
};

export type WakeLockSlice = WakeLockSliceState & {
	wakeLockToggle: (newWakeLockActive?: boolean) => Promise<boolean>;
};

export const createWakeLockSlice: AppWakeLockSlice = (set, get) => {
	sliceResetFns.add(() => set(settingsSliceInitialState));
	return {
		...settingsSliceInitialState,
		wakeLockToggle: async (active) => {
			const { wakeLockActive, wakeLockSentinel } = get();
			const newWakeLockActive = active ?? !wakeLockActive;
			if (wakeLockSentinel) {
				wakeLockSentinel.release();
			}
			const newWakeLockSentinel = newWakeLockActive
				? await navigator.wakeLock.request("screen")
				: null;
			set({
				wakeLockActive: newWakeLockActive,
				wakeLockSentinel: newWakeLockSentinel,
			});
			return newWakeLockActive;
		},
	};
};
