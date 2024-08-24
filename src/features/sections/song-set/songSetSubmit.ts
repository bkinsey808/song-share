import { FormEvent } from "react";

import { SongSet } from "./types";
import { songSetSave } from "@/actions/songSetSave";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const songSetSubmit =
	(get: Get, set: Set) => (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { songSetForm, songSetId, songSetLibrary } = get();

		if (!songSetForm) {
			console.error("no form");
			return;
		}

		return songSetForm.handleSubmit(async (songSet) => {
			const sessionCookieData = useAppStore.getState().sessionCookieData;

			if (!sessionCookieData) {
				toast({
					variant: "destructive",
					title: "Please sign in again",
				});
				return;
			}

			const { uid } = sessionCookieData;

			const songSaveResult = await songSetSave({
				songSet,
				songSetId,
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
						songSetForm.setError(key, {
							type: "manual",
							message,
						});
					});
					toast({
						variant: "destructive",
						title: "There was an error saving song set",
					});

					break;
				case actionResultType.SUCCESS:
					const newSongSetId = songSaveResult.songSetId;
					const newSongSetLibrarySongSet: SongSet = {
						...songSet,
						sharer: uid,
					};
					songSetLibrary[newSongSetId] = newSongSetLibrarySongSet;
					set({
						songSetLibrary,
						songSetId: newSongSetId,
						songSet,
					});
					songSetForm.reset(songSet, { keepValues: true });
					toast({ title: "Song Set details saved" });
					break;
			}
		})(e);
	};
