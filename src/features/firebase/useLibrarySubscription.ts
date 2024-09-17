import { useEffect } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";

export const useLibrarySubscription = () => {
	const {
		songIds,
		playlistIds,
		songLibraryUpdate,
		playlistLibraryUpdate,
		songLibraryUnsubscribe,
		playlistLibraryUnsubscribe,
	} = useAppStore();

	useEffect(() => {
		songLibraryUpdate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [songIds]);

	useEffect(() => {
		playlistLibraryUpdate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playlistIds]);

	useEffect(() => {
		return () => {
			songLibraryUnsubscribe();
			playlistLibraryUnsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
