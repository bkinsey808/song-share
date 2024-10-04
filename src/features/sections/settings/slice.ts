import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { settingsSubmit } from "./settingsSubmit";
import { Settings } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type SettingsSliceState = {
	settingsForm: UseFormReturn<Settings> | null;
};

type AppSettingsSlice = StateCreator<AppSlice, [], [], SettingsSlice>;

const settingsSliceInitialState: SettingsSliceState = {
	settingsForm: null,
};

export type SettingsSlice = SettingsSliceState & {
	settingsSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	setSettingsForm: (settingsForm: UseFormReturn<Settings>) => void;
};

export const createSettingsSlice: AppSettingsSlice = (set, get) => {
	sliceResetFns.add(() => set(settingsSliceInitialState));
	return {
		...settingsSliceInitialState,
		settingsSubmit: settingsSubmit(get, set),
		setSettingsForm: (settingsForm) => set({ settingsForm }),
	};
};