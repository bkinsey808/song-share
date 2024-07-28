import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";

import { SongDetails, SongLibrarySong } from "./types";
import { songDetailsSave } from "@/actions/songDetailsSave";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import { Get, Set } from "@/features/app-store/types";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { getKeys } from "@/features/global/getKeys";

export const songDetailsSubmit =
	(get: Get, set: Set) =>
	(form: UseFormReturn<SongDetails>) =>
	(e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		return form.handleSubmit(async (songDetails) => {
			console.log("in here");
			const username = useAuthStore.getState().sessionCookieData?.username;
			if (!username) {
				form.setError("root", {
					message: "Username is null",
				});
				return;
			}

			const originalSongId = get().songId;
			const result = await songDetailsSave({
				songDetails,
				songId: originalSongId,
			});

			form.reset(undefined, {
				keepValues: true,
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
					const newSongLibrarySong: SongLibrarySong = {
						songName: songDetails.songName,
						translation: songDetails.translation,
						sharer: username,
					};
					songLibrary[newSongId] = newSongLibrarySong;
					set({
						songLibrary,
						songId: newSongId,
						songName: songDetails.songName,
						translation: songDetails.translation,
					});
					toast({ title: "Song details saved" });
					break;
			}
		})(e);
	};
