import { logDefaultGet } from "./logDefaultGet";
import { Get, Set } from "@/features/app-store/types";

export const logNewClick = (get: Get, set: Set) => () => {
	const { sessionCookieData, logForm } = get();
	const uid = sessionCookieData?.uid;
	if (!uid) {
		console.error("no uid");
		return;
	}

	if (!logForm) {
		console.error("no form");
		return;
	}

	set({
		logId: null,
	});

	logForm.reset(
		{
			...logDefaultGet(),
			logId: "",
		},
		{
			keepDirty: false,
		},
	);
};
