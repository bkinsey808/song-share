import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { settingsSubmit } from "./settingsSubmit";
import { Settings } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type SettingsSliceState = {
	settingsForm: UseFormReturn<Settings> | null;
	timeZone: string | null;
};

type AppSettingsSlice = StateCreator<AppSlice, [], [], SettingsSlice>;

const settingsSliceInitialState: SettingsSliceState = {
	settingsForm: null,
	timeZone: null,
};

export type SettingsSlice = SettingsSliceState & {
	settingsSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	setSettingsForm: (settingsForm: UseFormReturn<Settings>) => void;
	timeZoneGet: () => string;
};

export const createSettingsSlice: AppSettingsSlice = (set, get) => {
	sliceResetFns.add(() => set(settingsSliceInitialState));
	return {
		...settingsSliceInitialState,
		settingsSubmit: settingsSubmit(get, set),
		setSettingsForm: (settingsForm) => set({ settingsForm }),
		timeZoneGet: () =>
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			get().timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
	};
};
