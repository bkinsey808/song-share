import { MouseEventHandler } from "react";

import { sectionId } from "../consts";
import { songIdSet } from "@/actions/songIdSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import type { Get, Set } from "@/features/app-store/types";

export const songLoadClick =
	(get: Get, set: Set) =>
	(songId: string) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const { songUnsavedIs, isSignedIn, sectionToggle } = get();
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

		set({
			songId,
		});

		sectionToggle(sectionId.SONG, true, true);

		toast({
			title: "Song loaded",
		});
	};
