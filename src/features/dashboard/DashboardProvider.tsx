"use client";

import { ReactNode, useEffect } from "react";

import { useAppStore } from "../app-store/useAppStore";

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
	const {
		fuid,
		setFuid,
		songIds,
		songSetIds,
		songLibraryUpdate,
		songSetLibraryUpdate,
	} = useAppStore();

	useEffect(() => {
		setFuid(null);
	}, [fuid, setFuid]);

	useEffect(() => {
		songLibraryUpdate();
	}, [songIds, songLibraryUpdate]);

	useEffect(() => {
		songSetLibraryUpdate();
	}, [songSetIds, songSetLibraryUpdate]);

	return <>{children}</>;
};
