import { FormEvent } from "react";

import { songLogFormDefaultGet } from "../song-log/songLogFormDefaultGet";
import { SongForm } from "./types";
import { songSave } from "@/actions/songSave";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/consts";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

type SongSubmit = (
	get: AppSliceGet,
	set: AppSliceSet,
) => (e: FormEvent<HTMLFormElement>) => Promise<void>;

export const songSubmit: SongSubmit = (get, set) => async (e) => {
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
			case ActionResultType.ERROR:
				const keys = songSaveResult.fieldErrors
					? getKeys(songSaveResult.fieldErrors)
					: undefined;
				keys?.forEach((key) => {
					const message = songSaveResult.fieldErrors?.[key]?.[0];
					if (!message) {
						return;
					}
					songForm.setError(key as keyof SongForm, {
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
			case ActionResultType.SUCCESS:
				songForm.reset(song);
				if (songSaveResult.songId) {
					songLibrary[songSaveResult.songId] = song;
					set({ songId: songSaveResult.songId });
				}

				const currentSongLogSongId = songLogForm?.getValues().songId;
				if (currentSongLogSongId !== songId) {
					songLogForm?.reset(
						{
							...songLogFormDefaultGet(),
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
