import { FormEvent } from "react";

import { settingsSave } from "@/actions/settingsSave";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/consts";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

type SettingsSubmit = (
	get: AppSliceGet,
	set: AppSliceSet,
) => (e: FormEvent<HTMLFormElement>) => Promise<void>;

export const settingsSubmit: SettingsSubmit = (get, set) => async (e) => {
	e.preventDefault();
	const { settingsForm } = get();

	if (!settingsForm) {
		console.error("no form");
		return;
	}

	return settingsForm.handleSubmit(async (settings) => {
		const { sessionCookieData } = useAppStore.getState();

		if (!sessionCookieData) {
			toast({
				variant: "destructive",
				title: "Please sign in again",
			});
			return;
		}

		const settingsSaveResult = await settingsSave({ settings });

		switch (settingsSaveResult.actionResultType) {
			case ActionResultType.ERROR:
				const keys = settingsSaveResult.fieldErrors
					? getKeys(settingsSaveResult.fieldErrors)
					: undefined;
				keys?.forEach((key) => {
					const message = settingsSaveResult.fieldErrors?.[key]?.[0];
					if (!message) {
						return;
					}
					settingsForm.setError(key, {
						type: "manual",
						message,
					});
				});

				toast({
					variant: "destructive",
					title: "There was an error saving settings",
				});

				break;
			case ActionResultType.SUCCESS:
				set({
					timeZone: settingsSaveResult.timeZone ?? null,
				});
				toast({ title: "Settings saved" });
				break;
		}
	})();
};
