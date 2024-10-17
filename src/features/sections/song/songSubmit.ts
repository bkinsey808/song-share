import { FormEvent } from "react";

import { songLogDefaultGet } from "../song-log/songLogDefaultGet";
import { songSave } from "@/actions/songSave";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const songSubmit =
	(get: Get, set: Set) => async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { songForm, songLogForm, songLibrary } = get();

		if (!songForm) {
			console.error("no form");
			return;
		}

		return songForm.handleSubmit(async (song) => {
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

					console.error(songSaveResult);

					toast({
						variant: "destructive",
						title: "There was an error saving song",
					});

					break;
				case actionResultType.SUCCESS:
					songForm.reset(song);
					if (songSaveResult.songId) {
						songLibrary[songSaveResult.songId] = song;
						set({ songId: songSaveResult.songId });
					}

					const currentSongLogSongId = songLogForm?.getValues().songId;
					if (currentSongLogSongId !== songId) {
						songLogForm?.reset(
							{
								...songLogDefaultGet(),
								songId: songId ?? "",
							},
							{
								keepDirty: false,
							},
						);
					}

					toast({ title: "Song details saved" });
					break;
			}
		})();
	};
