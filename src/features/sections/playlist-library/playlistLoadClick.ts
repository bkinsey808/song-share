import { MouseEventHandler } from "react";

import { playlistIdSet } from "@/actions/playlistIdSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import type { Get, Set } from "@/features/app-store/types";

export const playlistLoadClick =
	(get: Get, set: Set) =>
	(playlistId: string) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const { playlistIsUnsaved, isSignedIn } = get();
		if (playlistIsUnsaved) {
			toast({
				variant: "destructive",
				title: "Please save your current Playlist before loading a new one",
			});
			return;
		}

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

		const { playlistLibrary, playlistForm } = get();
		const playlist = playlistLibrary[playlistId];
		playlistForm?.reset?.(playlist);

		set({
			playlist,
			playlistId,
		});

		toast({
			title: "Playlist loaded",
		});
	};
