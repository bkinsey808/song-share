import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { backUpFormSubmit } from "./backUpFormSubmit";
import { BackUpForm } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type AdminSliceState = {
	backUpForm: UseFormReturn<BackUpForm> | null;
	backUpSubmitting: boolean;
};

type AppAdminSlice = StateCreator<AppSlice, [], [], AdminSlice>;

const adminSliceInitialState: AdminSliceState = {
	// timeZone is in the timeZone slice
	backUpForm: null,
	backUpSubmitting: false,
};

export type AdminSlice = AdminSliceState & {
	backUpFormSubmit: ReturnType<typeof backUpFormSubmit>;
	backUpFormSet: (backUpForm: UseFormReturn<BackUpForm>) => void;
};

export const createAdminSlice: AppAdminSlice = (set, get) => {
	sliceResetFns.add(() => set(adminSliceInitialState));
	return {
		...adminSliceInitialState,
		backUpFormSubmit: backUpFormSubmit(get, set),
		backUpFormSet: (backUpForm) => set({ backUpForm }),
	};
};
