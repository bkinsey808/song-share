import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { getStartedSubmit as getStartedFormSubmit } from "./getStartedFormSubmit";
import { GetStartedForm } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type GetStartedSliceState = {
	getStartedForm: UseFormReturn<GetStartedForm> | null;
};

type AppGetStartedSlice = StateCreator<AppSlice, [], [], GetStartedSlice>;

const getStartedSliceInitialState: GetStartedSliceState = {
	getStartedForm: null,
};

export type GetStartedSlice = GetStartedSliceState & {
	getStartedFormSubmit: (
		e: FormEvent<HTMLFormElement>,
	) => Promise<void> | undefined;
	getStartedFormSet: (getStartedForm: UseFormReturn<GetStartedForm>) => void;
};

export const createGetStartedSlice: AppGetStartedSlice = (set, get) => {
	sliceResetFns.add(() => set(getStartedSliceInitialState));
	return {
		...getStartedSliceInitialState,
		getStartedFormSubmit: getStartedFormSubmit(get, set),
		getStartedFormSet: (getStartedForm) => set({ getStartedForm }),
	};
};
