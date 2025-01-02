import { MouseEventHandler } from "react";
import { UseFormReturn } from "react-hook-form";

import { SongLogForm } from "./types";
import { toast } from "@/components/ui/use-toast";
import type { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const songLogLoadClick =
	(get: AppSliceGet, set: AppSliceSet) =>
	({
		logId,
		songId,
		form,
	}: {
		songId: string;
		logId: string;
		form: UseFormReturn<SongLogForm> | null;
	}) =>
	(e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]): void => {
		e.preventDefault();

		if (form?.formState.isDirty) {
			toast({
				variant: "destructive",
				title: "Please save your current song log before loading a new one",
			});
			return;
		}

		const { songLogs } = get();
		const logs = songLogs[songId];

		const log = logs.find((innerLog) => innerLog.logId === logId);

		form?.reset?.({ ...log, songId }, { keepDirty: false });

		set({
			songLogId: logId,
		});

		toast({
			title: "Song Log loaded",
		});
	};
