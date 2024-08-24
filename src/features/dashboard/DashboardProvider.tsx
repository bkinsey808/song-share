"use client";

import { ReactNode, useEffect } from "react";

import { useAppStore } from "../app-store/useAppStore";

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
	const { setFuid } = useAppStore();

	useEffect(() => {
		setFuid(null);
	}, [setFuid]);

	return <>{children}</>;
};
