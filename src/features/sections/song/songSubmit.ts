import { FormEvent } from "react";

import { Song } from "./types";
import { songSave } from "@/actions/songSave";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const songSubmit =
	(get: Get, set: Set) => async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = get().songForm;
		if (!form) {
			console.error("no form");
			return;
		}
		return form.handleSubmit(async (song) => {
			const sessionCookieData = useAppStore.getState().sessionCookieData;

			if (!sessionCookieData) {
				toast({
					variant: "destructive",
					title: "Please sign in again",
				});
				return;
			}

			const uid = sessionCookieData.uid;

			const originalSongId = get().songId;
			const songSaveResult = await songSave({
				song,
				songId: originalSongId,
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
				case actionResultType.SUCCESS:
					const newSongId = songSaveResult.songId;
					const songLibrary = get().songLibrary;
					const newSong: Song = {
						...song,
						sharer: uid,
					};
					songLibrary[newSongId] = newSong;
					set({
						songLibrary,
						songId: newSongId,
						song,
						songIds: songSaveResult.songIds,
					});
					form.reset(song, { keepValues: true });
					toast({ title: "Song details saved" });
					break;
			}
		})();
	};
