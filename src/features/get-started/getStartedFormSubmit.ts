import { FormEvent } from "react";

import { userIdFromUsernameGet } from "@/actions/userIdFromUsernameGet";
import { toast } from "@/components/ui/use-toast";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type GetStartedSubmit = (
	get: AppSliceGet,
	_set: AppSliceSet,
) => (e: FormEvent<HTMLFormElement>) => Promise<void>;

export const getStartedSubmit: GetStartedSubmit = (get, _set) => async (e) => {
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
