import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { songLogDeleteConfirmClick } from "../song-log/songLogDeleteConfirmClick";
import { songLogDeleteClick } from "./songLogDeleteClick";
import { songLogLoadClick } from "./songLogLoadClick";
import { songLogNewClick } from "./songLogNewClick";
import { songLogSubmit } from "./songLogSubmit";
import {
	AppSlice,
	sliceResetFns,
	useAppStore,
} from "@/features/app-store/useAppStore";
import { getValues } from "@/features/global/getKeys";
import { LogForm } from "@/features/sections/log/types";

type SongLogSliceState = {
	songLogForm: UseFormReturn<LogForm> | null;
	songLogId: string | null;
	songLogDeleting: boolean;
};

type AppSongLogSlice = StateCreator<AppSlice, [], [], SongLogSlice>;

const songSliceInitialState: SongLogSliceState = {
	songLogForm: null,
	songLogId: null,
	songLogDeleting: false,
};

export type SongLogSlice = SongLogSliceState & {
	songLogSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
	songLogNewClick: () => void;
	songLogDeleteClick: () => void;
	songLogDeleteConfirmClick: () => Promise<void>;
	songLogFormSet: (songLogForm: UseFormReturn<LogForm>) => void;
	songLogLoadClick: (
		logId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
	songLogIdsGet: (songId: string | null) => string[];
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
		songLogDeleteConfirmClick: songLogDeleteConfirmClick(get, set),
		songLogIdsGet: (songId) => {
			const { logs, logIds } = get();
			return logIds
				.filter(({ logId }) => logs[logId].songId === songId)
				.map(({ logId }) => logId);
		},
	};
};

// makes it reactive
export const useSongLogIds = (songId: string | null) =>
	useAppStore((state) => state.songLogIdsGet(songId));

export const useSongLogData = (songIds: string[]) =>
	useAppStore((state) => {
		const { logs } = state;
		return {
			songLogs: songIds.reduce((acc, songId) => {
				const songLogs = getValues(logs)
					.filter((log) => log.songId === songId)
					.sort((a, b) => a.date.localeCompare(b.date));
				return {
					...acc,
					[songId]: {
						logs: songLogs,
						count: songLogs.length,
						last: songLogs[0],
					},
				};
			}, {}),
		};
	});
