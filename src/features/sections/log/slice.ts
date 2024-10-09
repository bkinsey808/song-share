import { FormEvent, MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { logDeleteClick } from "./logDeleteClick";
import { logDeleteConfirmClick } from "./logDeleteConfirmClick";
import { logLoadClick } from "./logLoadClick";
import { logNewClick } from "./logNewClick";
import { logSubmit } from "./logSubmit";
import { Log, LogForm } from "./types";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

type LogSliceState = {
	logDeleting: boolean;
	logId: string | null;
	logForm: UseFormReturn<LogForm> | null;
	logs: Record<string, Log>;
	logIds: { logId: string }[];
};

type AppLogSlice = StateCreator<AppSlice, [], [], LogSlice>;

const logSliceInitialState: LogSliceState = {
	logId: null,
	logDeleting: false,
	logForm: null,
	logs: {},
	logIds: [],
};

export type LogSlice = LogSliceState & {
	logSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | undefined;
	logNewClick: () => void;
	logFormSet: (logForm: UseFormReturn<LogForm>) => void;
	logDeleteClick: () => void;
	logDeleteConfirmClick: () => Promise<void>;
	logIdSet: (logId: string | null) => void;
	logLoadClick: (
		songId: string,
	) => (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => void;
};

export const createLogSlice: AppLogSlice = (set, get) => {
	sliceResetFns.add(() => set(logSliceInitialState));
	return {
		...logSliceInitialState,
		logSubmit: logSubmit(get, set),
		logNewClick: logNewClick(get, set),
		logFormSet: (logForm) => set({ logForm }),
		logDeleteClick: logDeleteClick(get),
		logDeleteConfirmClick: logDeleteConfirmClick(get, set),
		logIdSet: (logId) => set({ logId }),
		logLoadClick: logLoadClick(get, set),
	};
};
