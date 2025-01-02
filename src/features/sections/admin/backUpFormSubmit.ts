import { FormEvent } from "react";

import { BackUpForm } from "./types";
import { backUp } from "@/actions/backUp";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/consts";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const backUpFormSubmit =
	(get: AppSliceGet, set: AppSliceSet) =>
	async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		const { backUpForm } = get();

		if (!backUpForm) {
			console.error("no form");
			return;
		}

		return backUpForm.handleSubmit(async (backUpFormValues) => {
			const { sessionCookieData } = useAppStore.getState();

			if (!sessionCookieData) {
				toast({
					variant: "destructive",
					title: "Please sign in again",
				});
				return;
			}

			set({ backUpSubmitting: true });

			const backUpResult = await backUp(backUpFormValues);

			switch (backUpResult.actionResultType) {
				case ActionResultType.ERROR:
					const keys = backUpResult.fieldErrors
						? getKeys(backUpResult.fieldErrors)
						: undefined;
					keys?.forEach((key) => {
						const message = backUpResult.fieldErrors?.[key]?.[0];
						if (!message) {
							return;
						}
						backUpForm.setError(
							key as keyof BackUpForm | "root" | `root.${string}`,
							{
								type: "manual",
								message,
							},
						);
					});

					toast({
						variant: "destructive",
						title: "There was an error submitting back up form",
					});

					break;
				case ActionResultType.SUCCESS:
					toast({ title: "Back up completed" });
					break;
			}

			set({ backUpSubmitting: false });
		})();
	};
