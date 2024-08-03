import { MouseEventHandler } from "react";

import { songSetLoad } from "@/actions/songSetLoad";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import type { Get, Set } from "@/features/app-store/types";

export const songSetLoadClick =
	(get: Get, set: Set) =>
	(songSetId: string) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const isSongSetLoaded = get().isSongSetUnsaved;
		if (isSongSetLoaded) {
			toast({
				variant: "destructive",
				title: "Please save your current Song Set before loading a new one",
			});
			return;
		}

		const result = await songSetLoad(songSetId);
		if (result.actionResultType === ActionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: result.message,
			});
			return;
		}

		const songSetLibrarySongSet = result.songSetLibrarySongSet;

		const oldSongSetLibrary = get().songSetLibrary;
		const newSongSetLibrary = {
			...oldSongSetLibrary,
			[songSetId]: songSetLibrarySongSet,
		};

		set({
			...songSetLibrarySongSet,
			songSetId,
			songSetLibrary: newSongSetLibrary,
		});

		toast({
			title: "Song Set loaded",
		});
	};
