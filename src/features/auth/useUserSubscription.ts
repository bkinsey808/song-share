import { useEffect } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";
import { useFirestoreClient } from "@/features/firebase/useFirebaseClient";

export const useUserSubscription = () => {
	const { userSubscribe, userUnsubscribe, sessionCookieData } = useAppStore();
	const { getDb, initialized, clearDb } = useFirestoreClient();

	const { uid } = sessionCookieData ?? {};

	useEffect(() => {
		if (!uid) {
			return;
		}
		const db = getDb();
		userSubscribe({ uid, db, clearDb });
		return userUnsubscribe;
	}, [userSubscribe, userUnsubscribe, uid, initialized]);
};
