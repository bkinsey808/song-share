import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { User } from "./types";
import { userLoadClick } from "./userLoadClick";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type UserLibrarySliceState = {
	userLibrary: Record<string, User>;
};

const userLibrarySliceInitialState: UserLibrarySliceState = {
	userLibrary: {},
};

export type UserLibrarySlice = UserLibrarySliceState & {
	userLoadClick: (
		userId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
};

type AppUserLibrarySlice = StateCreator<AppSlice, [], [], UserLibrarySlice>;

export const createUserLibrarySlice: AppUserLibrarySlice = (set, _get) => {
	sliceResetFns.add(() => set(userLibrarySliceInitialState));
	return {
		...userLibrarySliceInitialState,
		userLoadClick,
	};
};
