import { MouseEventHandler } from "react";

import { playlistLoad } from "@/actions/playlistLoad";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import type { Get, Set } from "@/features/app-store/types";

export const playlistLoadClick =
	(get: Get, set: Set) =>
	(playlistId: string) =>
	async (e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
		e.preventDefault();

		const { playlistIsUnsaved } = get();
		if (playlistIsUnsaved) {
			toast({
				variant: "destructive",
				title: "Please save your current Playlist before loading a new one",
			});
			return;
		}

		const result = await playlistLoad(playlistId);

		if (result.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: result.message,
			});
			return;
		}

		const { playlistIds } = result;

		const { playlistLibrary, playlistForm } = get();
		const playlist = playlistLibrary[playlistId];
		playlistForm?.reset?.(playlist);

		set({
			playlist,
			playlistIds,
			playlistId,
		});

		toast({
			title: "Playlist loaded",
		});
	};
