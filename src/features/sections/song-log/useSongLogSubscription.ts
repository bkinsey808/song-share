import { useEffect } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";

export const useSongLogSubscription = () => {
	const { songLogSubscribe, songLogUnsubscribe, sessionCookieData } =
		useAppStore();

	const uid = sessionCookieData?.uid;

	useEffect(() => {
		if (!uid) {
			return;
		}
		songLogSubscribe(uid);
		return songLogUnsubscribe;
	}, [songLogSubscribe, songLogUnsubscribe, uid]);
};
