import { MouseEventHandler } from "react";

import { songSetLoad } from "@/actions/songSetLoad";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import type { Get, Set } from "@/features/app-store/types";

export const songSetLoadClick =
	(get: Get, set: Set) =>
	(songSetId: string) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const { isSongSetUnsaved } = get();
		if (isSongSetUnsaved) {
			toast({
				variant: "destructive",
				title: "Please save your current Song Set before loading a new one",
			});
			return;
		}

		const result = await songSetLoad(songSetId);

		if (result.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: result.message,
			});
			return;
		}

		const { songSetIds } = result;

		const { songSetLibrary, songSetForm } = get();
		const songSet = songSetLibrary[songSetId];
		songSetForm?.reset?.(songSet);

		set({
			songSet,
			songSetIds,
			songSetId,
		});

		toast({
			title: "Song Set loaded",
		});
	};
