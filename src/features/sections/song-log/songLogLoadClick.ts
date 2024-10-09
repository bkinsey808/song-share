import { MouseEventHandler } from "react";

import { toast } from "@/components/ui/use-toast";
import type { Get, Set } from "@/features/app-store/types";

export const songLogLoadClick =
	(get: Get, set: Set) =>
	(logId: string) =>
	(e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const { songLogForm, logs } = get();
		if (songLogForm?.formState.isDirty) {
			toast({
				variant: "destructive",
				title: "Please save your current song log before loading a new one",
			});
			return;
		}

		const log = logs[logId];

		songLogForm?.reset?.({ ...log, logId });

		set({
			songLogId: logId,
		});

		toast({
			title: "Song Log loaded",
		});
	};
