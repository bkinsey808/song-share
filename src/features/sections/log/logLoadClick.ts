import { MouseEventHandler } from "react";

import { toast } from "@/components/ui/use-toast";
import type { Get, Set } from "@/features/app-store/types";

export const logLoadClick =
	(get: Get, set: Set) =>
	(logId: string) =>
	(e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const { logForm, logs } = get();
		if (logForm?.formState.isDirty) {
			toast({
				variant: "destructive",
				title: "Please save your current log before loading a new one",
			});
			return;
		}

		const log = logs[logId];

		logForm?.reset?.({ ...log, logId });

		set({
			logId,
		});

		toast({
			title: "Log loaded",
		});
	};
