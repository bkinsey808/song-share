import { useEffect } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";
import { useFirestoreClient } from "@/features/firebase/useFirebaseClient";

export const useSongLogSubscription = (): void => {
	const { songLogSubscribe, songLogUnsubscribe, sessionCookieData } =
		useAppStore();

	const uid = sessionCookieData?.uid;
	const { getDb, initialized, clearDb } = useFirestoreClient();

	useEffect(() => {
		if (!uid) {
			return;
		}
		const db = getDb();
		songLogSubscribe({ uid, db, clearDb });
		return songLogUnsubscribe;
	}, [songLogSubscribe, songLogUnsubscribe, uid, initialized, clearDb, getDb]);
};
