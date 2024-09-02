import { FormEvent } from "react";

import { songSetSave } from "@/actions/songSetSave";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const songSetSubmit =
	(get: Get, set: Set) => (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { songSetForm } = get();

		if (!songSetForm) {
			console.error("no form");
			return;
		}

		return songSetForm.handleSubmit(async (songSet) => {
			set({ songSetFormIsDisabled: true });
			const { sessionCookieData } = useAppStore.getState();

			if (!sessionCookieData) {
				toast({
					variant: "destructive",
					title: "Please sign in again",
				});
				return;
			}

			const { songSetId } = get();
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
					toast({ title: "Song Set details saved" });
					break;
			}
		})(e);
	};
