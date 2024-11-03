import { useEffect } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";

export const useUserLibrarySubscription = () => {
	const { userIds, userLibrarySubscribe, userLibraryUnsubscribe } =
		useAppStore();

	useEffect(() => {
		userLibrarySubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userIds]);

	useEffect(() => {
		return () => {
			userLibraryUnsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
