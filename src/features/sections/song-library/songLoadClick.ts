import { MouseEventHandler } from "react";

import { songLoad } from "@/actions/songLoad";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import type { Get, Set } from "@/features/app-store/types";

export const songLoadClick =
	(get: Get, set: Set) =>
	(songId: string) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const isSongLoaded = get().isSongUnsaved;
		if (isSongLoaded) {
			toast({
				variant: "destructive",
				title: "Please save your current song before loading a new one",
			});
			return;
		}

		const result = await songLoad(songId);
		if (result.actionResultType === ActionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: result.message,
			});
			return;
		}

		const songLibrarySong = result.songLibrarySong;

		const oldSongLibrary = get().songLibrary;
		const newSongLibrary = {
			...oldSongLibrary,
			[songId]: songLibrarySong,
		};

		set({
			...songLibrarySong,
			songId,
			songLibrary: newSongLibrary,
		});

		toast({
			title: "Song loaded",
		});
	};
