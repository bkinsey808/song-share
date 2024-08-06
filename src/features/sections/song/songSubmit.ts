import { FormEvent } from "react";

import { Song } from "./types";
import { songSave } from "@/actions/songSave";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import { OldGet, OldSet } from "@/features/app-store/types";
import { useAppSliceStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const songSubmit =
	(get: OldGet, set: OldSet) => async (e: FormEvent<HTMLFormElement>) => {
		const form = get().songForm;
		if (!form) {
			console.error("no form");
			return;
		}
		return form.handleSubmit(async (song) => {
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
				form.setError("root", {
					message: "Username is null",
				});
				return;
			}

			const originalSongId = get().songId;
			const result = await songSave({
				song,
				songId: originalSongId,
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
						title: "There was an error saving song",
					});

					break;
				case ActionResultType.SUCCESS:
					const newSongId = result.songId;
					const songLibrary = get().songLibrary;
					const newSong: Song = {
						...song,
						sharer: username,
					};
					songLibrary[newSongId] = newSong;
					set({
						songLibrary,
						songId: newSongId,
						...song,
					});
					console.log("reset");
					form.reset(song, { keepValues: true });
					toast({ title: "Song details saved" });
					break;
			}
		})(e);
	};
