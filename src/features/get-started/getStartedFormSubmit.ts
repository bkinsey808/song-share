import { FormEvent } from "react";

import { userIdFromUsernameGet } from "@/actions/userIdFromUsernameGet";
import { toast } from "@/components/ui/use-toast";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const getStartedSubmit =
	(get: AppSliceGet, set: AppSliceSet) =>
	async (e: FormEvent<HTMLFormElement>) => {
		console.log("here");
		e.preventDefault();
		const { getStartedForm } = get();

		if (!getStartedForm) {
			console.error("no form");
			return;
		}

		return getStartedForm.handleSubmit(async (values) => {
			const { songLeaderUserName } = values;

			// use the server action
			const getUserIdFromUserNameResult =
				await userIdFromUsernameGet(songLeaderUserName);
			if (getUserIdFromUserNameResult.actionResultType === "ERROR") {
				// toast
				toast({
					variant: "destructive",
					title: getUserIdFromUserNameResult.message,
				});
				return;
			}

			const { userId } = getUserIdFromUserNameResult;

			// use next router to navigat
			window.location.href = `/f/${userId}`;
		})();
	};