import { Get, Set } from "@/features/app-store/types";
import { logDefaultGet } from "@/features/sections/log/logDefaultGet";

export const songLogNewClick = (get: Get, set: Set) => () => {
	const { sessionCookieData, songLogForm, songId } = get();
	const uid = sessionCookieData?.uid;
	if (!uid) {
		console.error("no uid");
		return;
	}

	if (!songLogForm) {
		console.error("no form");
		return;
	}

	set({
		songLogId: null,
	});

	songLogForm.reset(
		{
			...logDefaultGet(),
			songId: songId ?? "",
			logId: "",
		},
		{
			keepDirty: false,
		},
	);
};
