import { MouseEventHandler } from "react";

import { songIdSet } from "@/actions/songIdSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import type { Get, Set } from "@/features/app-store/types";

export const songLoadClick =
	(get: Get, set: Set) =>
	(songId: string) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const { songUnsavedIs, isSignedIn } = get();
		if (songUnsavedIs) {
			toast({
				variant: "destructive",
				title: "Please save your current song before loading a new one",
			});
			return;
		}

		if (isSignedIn) {
			const result = await songIdSet({ songId });

			if (result.actionResultType === actionResultType.ERROR) {
				toast({
					variant: "destructive",
					title: result.message,
				});
				return;
			}
		}

		const { songLibrary, songForm } = get();
		const song = songLibrary[songId];
		songForm?.reset?.(song);

		set({
			song,
			songId,
		});

		toast({
			title: "Song loaded",
		});
	};
