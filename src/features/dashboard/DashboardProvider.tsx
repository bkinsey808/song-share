"use client";

import { ReactNode, useEffect } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
	const {
		fuid,
		setFuid,
		songIds,
		playlistIds,
		songLibraryUpdate,
		playlistLibraryUpdate,
		songLibraryUnsubscribe,
		playlistLibraryUnsubscribe,
		userUpdate,
		userUnsubscribe,
		sessionCookieData,
	} = useAppStore();

	const uid = sessionCookieData?.uid;

	useEffect(() => {
		setFuid(null);
	}, [fuid, setFuid]);

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

	useEffect(() => {
		if (!uid) {
			return;
		}
		userUpdate(uid);
		return userUnsubscribe;
	}, [userUpdate, userUnsubscribe, uid]);

	return <>{children}</>;
};
