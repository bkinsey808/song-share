import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { SongLogForm } from "@/features/sections/song-log/types";

type LogSliceState = {
	logForm: UseFormReturn<SongLogForm> | null;
};

type AppLogSlice = StateCreator<AppSlice, [], [], LogSlice>;

const logSliceInitialState: LogSliceState = {
	logForm: null,
};

export type LogSlice = LogSliceState & {
	logFormSet: (logForm: UseFormReturn<SongLogForm>) => void;
};

export const createLogSlice: AppLogSlice = (set, _get) => {
	sliceResetFns.add(() => set(logSliceInitialState));
	return {
		...logSliceInitialState,
		logFormSet: (logForm) => set({ logForm }),
	};
};
