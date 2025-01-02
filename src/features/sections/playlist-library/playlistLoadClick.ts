import { MouseEventHandler } from "react";

import { sectionId } from "../consts";
import { playlistIdSet } from "@/actions/playlistIdSet";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/consts";
import type { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type PlaylistLoadClick = (
	get: AppSliceGet,
	set: AppSliceSet,
) => (
	playlistId: string | null,
) => (
	e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"],
) => Promise<void>;

export const playlistLoadClick: PlaylistLoadClick =
	(get, set) => (playlistId) => async (e) => {
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

			if (result.actionResultType === ActionResultType.ERROR) {
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
