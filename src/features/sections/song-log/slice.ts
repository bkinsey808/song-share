import { Unsubscribe } from "firebase/firestore";
import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { songLogDeleteClick } from "./songLogDeleteClick";
import { songLogLoadClick } from "./songLogLoadClick";
import { songLogNewClick } from "./songLogNewClick";
import { songLogSubmit } from "./songLogSubmit";
import { songLogSubscribe } from "./songLogSubscribe";
import { songLogUnsubscribe } from "./songLogUnsubscribe";
import { SongLogEntry, SongLogForm } from "./types";
import {
	AppSlice,
	sliceResetFns,
	useAppStore,
} from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

type SongLogSliceState = {
	songLogForm: UseFormReturn<SongLogForm> | null;
	songLogId: string | null;
	songLogDeleting: boolean;
	songLogs: Record<string, SongLogEntry[]>;
	songLogUnsubscribeFn: Unsubscribe | null;
};

type AppSongLogSlice = StateCreator<AppSlice, [], [], SongLogSlice>;

const songSliceInitialState: SongLogSliceState = {
	songLogForm: null,
	songLogId: null,
	songLogDeleting: false,
	songLogs: {},
	songLogUnsubscribeFn: null,
};

export type SongLogSlice = SongLogSliceState & {
	songLogSubmit: (
		form: UseFormReturn<SongLogForm>,
	) => (e: FormEvent<HTMLFormElement>) => Promise<void>;
	songLogNewClick: ({
		form,
		songId,
	}: {
		form: UseFormReturn<SongLogForm>;
		songId?: string | null;
	}) => () => void;
	songLogDeleteClick: ({
		songId,
		logId,
		form,
		shouldClearSongId,
	}: {
		songId: string;
		logId: string;
		form: UseFormReturn<SongLogForm>;
		shouldClearSongId: boolean;
	}) => () => void;
	songLogFormSet: (songLogForm: UseFormReturn<SongLogForm>) => void;
	songLogLoadClick: ({
		logId,
		songId,
		form,
	}: {
		songId: string;
		logId: string;
		form: UseFormReturn<SongLogForm> | null;
	}) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songLogIdsGet: (songId: string | null) => string[];
	songLogSubscribe: (uid: string) => void;
	songLogUnsubscribe: () => void;
};

export const createSongLogSlice: AppSongLogSlice = (set, get) => {
	sliceResetFns.add(() => set(songSliceInitialState));
	return {
		...songSliceInitialState,
		songLogSubmit: songLogSubmit(get, set),
		songLogNewClick: songLogNewClick(get, set),
		songLogFormSet: (songLogForm) => set({ songLogForm }),
		songLogLoadClick: songLogLoadClick(get, set),
		songLogDeleteClick: songLogDeleteClick(get),
		songLogIdsGet: (songId) => {
			const { songLogs } = get();
			if (!songId) {
				return [];
			}
			return songLogs[songId]?.map((log) => log.logId) ?? [];
		},
		songLogSubscribe: songLogSubscribe(get, set),
		songLogUnsubscribe: songLogUnsubscribe(get, set),
	};
};

type SongLogEntrySong = SongLogEntry & { songId: string };

// makes it reactive
export const useSongLogs = (songId?: string | null) =>
	useAppStore((state) => {
		if (songId) {
			return (
				state.songLogs[songId]?.map((entry) => ({ ...entry, songId })) ?? []
			);
		}
		const songIds = getKeys(state.songLogs);
		const songLogs = songIds.reduce((acc, innerSongId) => {
			const v = state.songLogs[innerSongId].map((entry) => ({
				...entry,
				songId: innerSongId,
			}));
			acc = acc.concat(v);
			return acc;
		}, [] as SongLogEntrySong[]);
		return songLogs;
	});
