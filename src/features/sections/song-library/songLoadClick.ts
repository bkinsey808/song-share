import { MouseEventHandler } from "react";

import { sectionId } from "../consts";
import { songIdSet } from "@/actions/songIdSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import type { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const songLoadClick =
	(get: AppSliceGet, set: AppSliceSet) =>
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

		set({
			songId,
		});

		sectionToggle(sectionId.SONG, true, true);

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

		toast({
			title: "Song loaded",
		});
	};
