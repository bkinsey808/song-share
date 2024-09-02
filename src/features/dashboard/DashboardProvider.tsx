"use client";

import { ReactNode, useEffect } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
	const {
		fuid,
		setFuid,
		songIds,
		songSetIds,
		songLibraryUpdate,
		songSetLibraryUpdate,
		songLibraryUnsubscribe,
		songSetLibraryUnsubscribe,
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
		songSetLibraryUpdate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [songSetIds]);

	useEffect(() => {
		return () => {
			songLibraryUnsubscribe();
			songSetLibraryUnsubscribe();
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
