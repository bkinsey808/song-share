import { FormEvent } from "react";

import { SongSetLibrarySongSet } from "./types";
import { songSetSave } from "@/actions/songSetSave";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import { OldGet, OldSet } from "@/features/app-store/types";
import { useAppSliceStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const songSetSubmit =
	(get: OldGet, set: OldSet) => (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { songSetForm, songSetId, songSetLibrary } = get();
		if (!songSetForm) {
			console.error("no form");
			return;
		}
		return songSetForm.handleSubmit(async (songSet) => {
			const sessionCookieData = useAppSliceStore.getState().sessionCookieData;

			if (!sessionCookieData) {
				toast({
					variant: "destructive",
					title: "Please sign in again",
				});
				return;
			}

			const username = sessionCookieData.username;
			if (!username) {
				songSetForm.setError("root", {
					message: "Username is null",
				});
				return;
			}

			const result = await songSetSave({
				songSet,
				songSetId,
			});

			switch (result.actionResultType) {
				case ActionResultType.ERROR:
					const keys = result.fieldErrors
						? getKeys(result.fieldErrors)
						: undefined;
					keys?.forEach((key) => {
						const message = result.fieldErrors?.[key]?.[0];
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
				case ActionResultType.SUCCESS:
					const newSongSetId = result.songSetId;
					const newSongSetLibrarySongSet: SongSetLibrarySongSet = {
						...songSet,
						sharer: username,
					};
					songSetLibrary[newSongSetId] = newSongSetLibrarySongSet;
					set({
						songSetLibrary,
						songSetId: newSongSetId,
						...songSet,
					});
					console.log("reset");
					songSetForm.reset(songSet, { keepValues: true });
					toast({ title: "Song Set details saved" });
					break;
			}
		})(e);
	};
