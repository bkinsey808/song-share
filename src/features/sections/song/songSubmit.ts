import { FormEvent } from "react";

import { songSave } from "@/actions/songSave";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const songSubmit =
	(get: Get, set: Set) => async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { songForm } = get();

		if (!songForm) {
			console.error("no form");
			return;
		}

		return songForm.handleSubmit(async (song) => {
			set({ songFormIsDisabled: true });
			const { sessionCookieData } = useAppStore.getState();

			if (!sessionCookieData) {
				toast({
					variant: "destructive",
					title: "Please sign in again",
				});
				return;
			}

			const { songId, songIsUnsavedSet } = get();
			const songSaveResult = await songSave({
				song,
				songId,
			});
			songIsUnsavedSet(false);

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
						songForm.setError(key, {
							type: "manual",
							message,
						});
					});

					toast({
						variant: "destructive",
						title: "There was an error saving song",
					});

					break;
				case actionResultType.SUCCESS:
					toast({ title: "Song details saved" });
					break;
			}
		})();
	};
