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
		return songLibraryUnsubscribe;
	}, [songIds, songLibraryUpdate, songLibraryUnsubscribe]);

	useEffect(() => {
		songSetLibraryUpdate();
		return songSetLibraryUnsubscribe;
	}, [songSetIds, songSetLibraryUpdate, songSetLibraryUnsubscribe]);

	useEffect(() => {
		if (!uid) {
			return;
		}
		userUpdate(uid);
		return userUnsubscribe;
	}, [userUpdate, userUnsubscribe, uid]);

	return <>{children}</>;
};
