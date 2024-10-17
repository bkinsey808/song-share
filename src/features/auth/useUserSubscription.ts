import { useEffect } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";

export const useUserSubscription = () => {
	const { userSubscribe, userUnsubscribe, sessionCookieData } = useAppStore();

	const uid = sessionCookieData?.uid;

	useEffect(() => {
		if (!uid) {
			return;
		}
		userSubscribe(uid);
		return userUnsubscribe;
	}, [userSubscribe, userUnsubscribe, uid]);
};
