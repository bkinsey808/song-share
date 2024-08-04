import { FormEvent } from "react";

import { SongSetLibrarySongSet } from "./types";
import { songSetSave } from "@/actions/songSetSave";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import { Get, Set } from "@/features/app-store/types";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { getKeys } from "@/features/global/getKeys";

export const songSetSubmit =
	(get: Get, set: Set) => (e: FormEvent<HTMLFormElement>) => {
		const form = get().songSetForm;
		if (!form) {
			console.error("no form");
			return;
		}
		return form.handleSubmit(async (songSet) => {
			const sessionCookieData = useAuthStore.getState().sessionCookieData;

			if (!sessionCookieData) {
				toast({
					variant: "destructive",
					title: "Please sign in again",
				});
				return;
			}

			const username = sessionCookieData.username;
			if (!username) {
				form.setError("root", {
					message: "Username is null",
				});
				return;
			}

			const originalSongSetId = get().songSetId;
			const result = await songSetSave({
				songSet,
				songSetId: originalSongSetId,
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
						form.setError(key, {
							type: "manual",
							message,
						});
					});
					toast({
						variant: "destructive",
						title: "There was an error saving songSet",
					});

					break;
				case ActionResultType.SUCCESS:
					const newSongSetId = result.songSetId;
					const songSetLibrary = get().songSetLibrary;
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
					form.reset(songSet, { keepValues: true });
					toast({ title: "SongSet details saved" });
					break;
			}
		})(e);
	};
