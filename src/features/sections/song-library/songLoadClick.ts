import { MouseEventHandler } from "react";

import { songLoad } from "@/actions/songLoad";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import type { Get, Set } from "@/features/app-store/types";

export const songLoadClick =
	(get: Get, set: Set) =>
	(songId: string) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const { isSongUnsaved } = get();
		if (isSongUnsaved) {
			toast({
				variant: "destructive",
				title: "Please save your current song before loading a new one",
			});
			return;
		}

		const result = await songLoad({ songId });

		if (result.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: result.message,
			});
			return;
		}

		const { songIds } = result;

		set({
			songIds,
			songId,
		});

		toast({
			title: "Song loaded",
		});
	};
