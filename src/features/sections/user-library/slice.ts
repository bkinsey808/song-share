import { MouseEventHandler } from "react";
import { StateCreator } from "zustand";

import { userLoadClick } from "./userLoadClick";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import { UserPublicDoc } from "@/features/firebase/types";

type UserLibrarySliceState = {
	userLibrary: Record<string, UserPublicDoc>;
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
