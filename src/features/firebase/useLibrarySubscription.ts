import { useEffect } from "react";

import { useFirestoreClient } from "./useFirebaseClient";
import { useAppStore } from "@/features/app-store/useAppStore";

export const useLibrarySubscription = () => {
	const {
		songIds,
		playlistIds,
		songLibrarySubscribe,
		playlistLibrarySubscribe,
		songLibraryUnsubscribe,
		playlistLibraryUnsubscribe,
	} = useAppStore();

	const { getDb, initialized, clearDb } = useFirestoreClient();

	useEffect(() => {
		const db = getDb();
		songLibrarySubscribe({ db, clearDb });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [songIds, initialized]);

	useEffect(() => {
		const db = getDb();
		playlistLibrarySubscribe({ db, clearDb });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playlistIds, initialized]);

	useEffect(() => {
		return () => {
			songLibraryUnsubscribe();
			playlistLibraryUnsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
