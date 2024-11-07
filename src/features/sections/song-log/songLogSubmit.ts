import { FormEvent } from "react";
import { UseFormReturn } from "react-hook-form";

import { SongLogForm } from "./types";
import { songLogSave } from "@/actions/songLogSave";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const songLogSubmit =
	(_get: AppSliceGet, _set: AppSliceSet) =>
	(form: UseFormReturn<SongLogForm>) =>
	async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!form) {
			console.error("no form");
			return;
		}

		return form.handleSubmit(async (logFormValues) => {
			const { sessionCookieData } = useAppStore.getState();

			if (!sessionCookieData) {
				toast({
					variant: "destructive",
					title: "Please sign in again",
				});
				return;
			}

			const logSaveResult = await songLogSave({
				...logFormValues,
			});

			switch (logSaveResult.actionResultType) {
				case actionResultType.ERROR:
					const keys = logSaveResult.fieldErrors
						? getKeys(logSaveResult.fieldErrors)
						: undefined;
					keys?.forEach((key) => {
						const message = logSaveResult.fieldErrors?.[key]?.[0];
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
						title: "There was an error saving song log",
					});

					break;
				case actionResultType.SUCCESS:
					// this also sets the form to not dirty
					form.reset({
						...logFormValues,
						logId: logSaveResult.logId,
					});
					toast({ title: "Song Log saved" });
					break;
			}
		})();
	};
