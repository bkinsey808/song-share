import { MouseEventHandler } from "react";

import { songLoad } from "@/actions/songLoad";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import type { OldGet, OldSet } from "@/features/app-store/types";

export const songSetSongLoadClick =
	(get: OldGet, set: OldSet) =>
	({ songId, songSetId }: { songId: string; songSetId: string | null }) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const { isSongUnsaved, songForm } = get();
		if (isSongUnsaved) {
			toast({
				variant: "destructive",
				title: "Please save your current song before loading a new one",
			});
			return;
		}

		if (!songForm) {
			console.error("no form");
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

		songForm.reset(songLibrarySong);

		toast({
			title: "Song loaded",
		});
	};
