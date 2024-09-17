import { useEffect } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";

export const useUserSubscription = () => {
	const { userUpdate, userUnsubscribe, sessionCookieData } = useAppStore();

	const uid = sessionCookieData?.uid;

	useEffect(() => {
		if (!uid) {
			return;
		}
		userUpdate(uid);
		return userUnsubscribe;
	}, [userUpdate, userUnsubscribe, uid]);
};
