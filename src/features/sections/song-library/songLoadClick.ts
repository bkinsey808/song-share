import { MouseEventHandler } from "react";

import { sectionId } from "../consts";
import { songIdSet } from "@/actions/songIdSet";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/consts";
import type { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type SongLoadClick = (
	get: AppSliceGet,
	set: AppSliceSet,
) => (
	songId: string,
) => (
	e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"],
) => Promise<void>;

export const songLoadClick: SongLoadClick =
	(get, set) => (songId) => async (e) => {
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

			if (result.actionResultType === ActionResultType.ERROR) {
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
