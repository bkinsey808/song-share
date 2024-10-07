import { FormEvent } from "react";

import { logSave } from "@/actions/logSave";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const logSubmit =
	(get: Get, set: Set) => async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { logForm, logId } = get();

		if (!logForm) {
			console.error("no form");
			return;
		}

		return logForm.handleSubmit(async (logFormValues) => {
			const { sessionCookieData } = useAppStore.getState();

			if (!sessionCookieData) {
				toast({
					variant: "destructive",
					title: "Please sign in again",
				});
				return;
			}

			const logSaveResult = await logSave({
				...logFormValues,
				logId: logId ?? "",
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
						logForm.setError(key, {
							type: "manual",
							message,
						});
					});

					toast({
						variant: "destructive",
						title: "There was an error saving log",
					});

					break;
				case actionResultType.SUCCESS:
					set({ logId: logSaveResult.logId });
					// this also sets the form to not dirty
					logForm.reset({
						...logFormValues,
						logId: logSaveResult.logId,
					});
					toast({ title: "Log saved" });
					break;
			}
		})();
	};
