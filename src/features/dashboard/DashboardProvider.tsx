"use client";

import { ReactNode, useEffect } from "react";

import { useAppStore } from "../app-store/useAppStore";

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
	const { fuid, setFuid } = useAppStore();

	useEffect(() => {
		setFuid(null);
	}, [fuid, setFuid]);

	return <>{children}</>;
};
