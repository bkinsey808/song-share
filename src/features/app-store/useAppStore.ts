import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
	UserLibrarySlice,
	createUserLibrarySlice,
} from "../sections/user-library/slice";
import { AuthSlice, createAuthSlice } from "@/features/auth/slice";
import { type ModalSlice, createModalSlice } from "@/features/modal/slice";
import { SectionSlice, createSectionSlice } from "@/features/section/slice";
import {
	SongLibrarySlice,
	createSongLibrarySlice,
} from "@/features/sections/song-library/slice";
import {
	SongSetLibrarySlice,
	createSongSetLibrarySlice,
} from "@/features/sections/song-set-library/slice";
import {
	SongSetSlice,
	createSongSetSlice,
} from "@/features/sections/song-set/slice";
import { SongSlice, createSongSlice } from "@/features/sections/song/slice";

export const sliceResetFns = new Set<() => void>();

export const resetAllSlices = () => {
	sliceResetFns.forEach((resetFn) => {
		resetFn();
	});
};

export type AppSlice = ModalSlice &
	SectionSlice &
	AuthSlice &
	SongSlice &
	SongSetSlice &
	SongLibrarySlice &
	SongSetLibrarySlice &
	UserLibrarySlice;

/** for security, these shall not be stored in localStorage */
const omittedKeys: (keyof AppSlice)[] = [
	"isSignedIn",
	"sessionCookieData",
	"deletingAccount",
	"registerError",
	"lastSignInCheck",
	"isSigningIn",
	"openAppModal",
	"addingSongToSongSet",
	"deletingSong",
	"deletingSongSet",
];

export const useAppStore = create<AppSlice>()(
	persist(
		(...a) => ({
			...createSectionSlice(...a),
			...createModalSlice(...a),
			...createAuthSlice(...a),
			...createSongSlice(...a),
			...createSongSetSlice(...a),
			...createSongLibrarySlice(...a),
			...createSongSetLibrarySlice(...a),
			...createUserLibrarySlice(...a),
		}),
		{
			name: "app-store",
			partialize: (state) =>
				Object.fromEntries(
					Object.entries(state).filter(
						([key]) => !omittedKeys.includes(key as keyof AppSlice),
					),
				),
		},
	),
);
