import { MouseEventHandler } from "react";

import { sectionId } from "../consts";
import { playlistIdSet } from "@/actions/playlistIdSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import type { Get, Set } from "@/features/app-store/types";

export const playlistLoadClick =
	(get: Get, set: Set) =>
	(playlistId: string | null) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const { playlistIsUnsaved, isSignedIn, sectionToggle } = get();
		if (playlistIsUnsaved) {
			toast({
				variant: "destructive",
				title: "Please save your current Playlist before loading a new one",
			});
			return;
		}

		set({
			playlistId,
		});

		sectionToggle(sectionId.PLAYLIST, true, true);

		if (isSignedIn) {
			const result = await playlistIdSet(playlistId);

			if (result.actionResultType === actionResultType.ERROR) {
				toast({
					variant: "destructive",
					title: result.message,
				});
				return;
			}
		}

		toast({
			title: "Playlist loaded",
		});
	};
