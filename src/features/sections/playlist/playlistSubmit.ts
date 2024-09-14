import { FormEvent } from "react";

import { playlistSave } from "@/actions/playlistSave";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const playlistSubmit =
	(get: Get, set: Set) => (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { playlistForm } = get();

		if (!playlistForm) {
			console.error("no form");
			return;
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

			const { playlistId } = get();
			const songSaveResult = await playlistSave({
				playlist,
				playlistId,
			});

			switch (songSaveResult.actionResultType) {
				case actionResultType.ERROR:
					const keys = songSaveResult.fieldErrors
						? getKeys(songSaveResult.fieldErrors)
						: undefined;
					keys?.forEach((key) => {
						const message = songSaveResult.fieldErrors?.[key]?.[0];
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
				case actionResultType.SUCCESS:
					toast({ title: "Playlist details saved" });
					break;
			}
		})(e);
	};
