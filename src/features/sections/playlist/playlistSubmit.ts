import { FormEvent } from "react";

import { playlistSave } from "@/actions/playlistSave";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/consts";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

type PlaylistSubmit = (
	get: AppSliceGet,
	set: AppSliceSet,
) => (e: FormEvent<HTMLFormElement>) => Promise<void>;

export const playlistSubmit: PlaylistSubmit = (get, set) => (e) => {
	e.preventDefault();
	const { playlistForm, playlistLibrary } = get();

	if (!playlistForm) {
		console.error("no form");
		return Promise.resolve();
	}

	return playlistForm.handleSubmit(async (playlist) => {
		set({ playlistFormIsDisabled: true });
		const { sessionCookieData } = useAppStore.getState();

		if (!sessionCookieData) {
			toast({
				variant: "destructive",
				title: "Please sign in again",
			});
			return;
		}

		const { playlistId, playlistIsUnsavedSet } = get();
		const playlistSaveResult = await playlistSave({
			playlist,
			playlistId,
		});
		playlistIsUnsavedSet(false);

		switch (playlistSaveResult.actionResultType) {
			case ActionResultType.ERROR:
				const keys = playlistSaveResult.fieldErrors
					? getKeys(playlistSaveResult.fieldErrors)
					: undefined;
				keys?.forEach((key) => {
					const message = playlistSaveResult.fieldErrors?.[key]?.[0];
					if (!message) {
						return;
					}
					playlistForm.setError(key, {
						type: "manual",
						message,
					});
				});
				toast({
					variant: "destructive",
					title: "There was an error saving playlist",
				});

				break;
			case ActionResultType.SUCCESS:
				playlistForm.reset(playlist);
				if (playlistSaveResult.playlistId) {
					playlistLibrary[playlistSaveResult.playlistId] = playlist;
					set({ playlistId: playlistSaveResult.playlistId });
				}

				toast({ title: "Playlist details saved" });
				break;
		}
	})(e);
};
