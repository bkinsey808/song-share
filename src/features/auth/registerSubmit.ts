import { UseFormReturn } from "react-hook-form";

import { actionResultType } from "../app-store/consts";
import { Get, Set } from "../app-store/types";
import { useAppStore } from "../app-store/useAppStore";
import { getKeys } from "../global/getKeys";
import { RegistrationData } from "./types";
import { register } from "@/actions/register";
import { toast } from "@/components/ui/use-toast";

export const registerSubmit =
	(get: Get, set: Set) =>
	(form: UseFormReturn<RegistrationData>) =>
	(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		return form.handleSubmit(async (registrationData) => {
			{
				const sessionCookieData = get().sessionCookieData;

				if (!sessionCookieData) {
					form.setError("root", {
						type: "manual",
						message: "Sign in data is not defined",
					});

					toast({
						variant: "destructive",
						title: "There was an error registering",
					});
					return;
				}

				const result = await register({
					email: sessionCookieData.email,
					picture: sessionCookieData.picture,
					registrationData,
				});

				switch (result.actionResultType) {
					case actionResultType.ERROR:
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
							title: "There was an error registering",
						});

						break;
					case actionResultType.SUCCESS:
						set({
							isSignedIn: true,
							sessionCookieData: {
								...result.sessionCookieData,
								roles: result.sessionCookieData.roles,
							},
						});
						useAppStore.getState().setOpenAppModal(null);
						toast({ title: "You have been registered" });
						break;
				}
			}
		})(e);
	};
