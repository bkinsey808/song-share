import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AuthSlice, createAuthSlice } from "@/features/auth/slice";
import {
	FollowingSlice,
	createFollowingSlice,
} from "@/features/following/slice";
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
import {
	SongLogSlice,
	createSongLogSlice,
} from "@/features/sections/song-log/slice";
import {
	SongRequestsSlice,
	createSongRequestsSlice,
} from "@/features/sections/song-requests/slice";
import { SongSlice, createSongSlice } from "@/features/sections/song/slice";
import {
	UserLibrarySlice,
	createUserLibrarySlice,
} from "@/features/sections/user-library/slice";
import { TimeZoneSlice, createTimeZoneSlice } from "@/features/time-zone/slice";

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
	TimeZoneSlice &
	SongSlice &
	PlaylistSlice &
	SongLibrarySlice &
	PlaylistLibrarySlice &
	UserLibrarySlice &
	FollowingSlice &
	LogSlice &
	SongLogSlice &
	SongRequestsSlice &
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
	"playlistSongAdding",
	"songUnsubscribeFns",
	"playlistUnsubscribeFns",
	"songDeleting",
	"playlistDeletingIs",
	"confirmModalButtonLabel",
	"confirmModalError",
	"confirmModalFn",
	"confirmModalHeading",
	"confirmModalSuccessWaiting",
	"ConfirmModalContent",
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
			...createTimeZoneSlice(...a),
			...createLogSlice(...a),
			...createSongLogSlice(...a),
			...createQRSlice(...a),
			...createSongRequestsSlice(...a),
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
