import { create } from "zustand";
import { persist } from "zustand/middleware";

import { FollowingSlice, createFollowingSlice } from "../following/slice";
import {
	UserLibrarySlice,
	createUserLibrarySlice,
} from "../sections/user-library/slice";
import { AuthSlice, createAuthSlice } from "@/features/auth/slice";
import { type ModalSlice, createModalSlice } from "@/features/modal/slice";
import { SectionSlice, createSectionSlice } from "@/features/section/slice";
import { LogSlice, createLogSlice } from "@/features/sections/log/slice";
import {
	PlaylistLibrarySlice,
	createPlaylistLibrarySlice,
} from "@/features/sections/playlist-library/slice";
import {
	PlaylistSlice,
	createPlaylistSlice,
} from "@/features/sections/playlist/slice";
import { QRSlice, createQRSlice } from "@/features/sections/qr/slice";
import {
	SettingsSlice,
	createSettingsSlice,
} from "@/features/sections/settings/slice";
import {
	SongLibrarySlice,
	createSongLibrarySlice,
} from "@/features/sections/song-library/slice";
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
	SettingsSlice &
	SongSlice &
	PlaylistSlice &
	SongLibrarySlice &
	PlaylistLibrarySlice &
	UserLibrarySlice &
	FollowingSlice &
	LogSlice &
	QRSlice;

/** for security, these shall not be stored in localStorage */
const omittedKeys: (keyof AppSlice)[] = [
	"isSignedIn",
	"sessionCookieData",
	"deletingAccount",
	"registerError",
	"lastSignInCheck",
	"isSigningIn",
	"openAppModal",
	"addingSongToPlaylist",
	"songUnsubscribeFns",
	"playlistUnsubscribeFns",
	"logDeletingIs",
	"songDeletingIs",
	"playlistDeletingIs",
];

export const useAppStore = create<AppSlice>()(
	persist(
		(...a) => ({
			...createSectionSlice(...a),
			...createModalSlice(...a),
			...createAuthSlice(...a),
			...createSongSlice(...a),
			...createPlaylistSlice(...a),
			...createSongLibrarySlice(...a),
			...createPlaylistLibrarySlice(...a),
			...createUserLibrarySlice(...a),
			...createFollowingSlice(...a),
			...createSettingsSlice(...a),
			...createLogSlice(...a),
			...createQRSlice(...a),
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
