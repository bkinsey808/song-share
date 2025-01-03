import { Unsubscribe } from "firebase/firestore";
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
	songLogSubmit: ReturnType<typeof songLogSubmit>;
	songLogNewClick: ReturnType<typeof songLogNewClick>;
	songLogDeleteClick: ReturnType<typeof songLogDeleteClick>;
	songLogFormSet: (songLogForm: UseFormReturn<SongLogForm>) => void;
	songLogLoadClick: ReturnType<typeof songLogLoadClick>;
	songLogIdsGet: (songId: string | null) => string[];
	songLogSubscribe: ReturnType<typeof songLogSubscribe>;
	songLogUnsubscribe: ReturnType<typeof songLogUnsubscribe>;
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
		songLogIdsGet: (songId): string[] => {
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
export const useSongLogs = (songId?: string | null): SongLogEntrySong[] =>
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
			return acc.concat(v);
		}, [] as SongLogEntrySong[]);
		return songLogs;
	});
