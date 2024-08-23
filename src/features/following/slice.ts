import { StateCreator } from "zustand";

import { AppSlice, sliceResetFns } from "../app-store/useAppStore";
import { PublicUserDoc } from "../firebase/types";

type FollowingSliceState = {
	following: PublicUserDoc | null;
	fuid: string | null;
};

const followingSliceInitialState: FollowingSliceState = {
	following: null,
	fuid: null,
};

export type FollowingSlice = FollowingSliceState & {
	setFollowing: (following: PublicUserDoc | null) => void;
	setFuid: (fuid: string | null) => void;
};

type AppFollowingSlice = StateCreator<AppSlice, [], [], FollowingSlice>;

export const createFollowingSlice: AppFollowingSlice = (set, _get) => {
	sliceResetFns.add(() => set(followingSliceInitialState));
	return {
		...followingSliceInitialState,
		setFollowing: (following) => set({ following }),
		setFuid: (fuid) => set({ fuid }),
	};
};
