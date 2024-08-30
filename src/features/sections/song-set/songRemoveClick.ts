import { MouseEventHandler } from "react";

import { songRemove } from "@/actions/songRemove";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import type { Get, Set } from "@/features/app-store/types";

export const songRemoveClick =
	(get: Get, set: Set) =>
	({ songId, songSetId }: { songId: string; songSetId: string }) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const songRemoveResult = await songRemove({ songId, songSetId });

		if (songRemoveResult.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: songRemoveResult.message,
			});
			return;
		}

		const { songSet, song } = songRemoveResult;

		const songLibrary = get().songLibrary;
		songLibrary[songId] = song;

		set({
			songSet,
			songLibrary,
		});

		const currentSongId = get().songId;

		if (currentSongId === songId) {
			set({ song });
			const songForm = get().songForm;
			songForm?.reset?.(song);
		}

		toast({
			title: "Song removed",
		});
	};
