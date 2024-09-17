"use client";

import { ReactNode, useEffect } from "react";

import { useAppStore } from "@/features/app-store/useAppStore";
import { useLibrarySubscription } from "@/features/firebase/useLibrarySubscription";
import { useUserSubscription } from "@/features/firebase/useUserSubscription";

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
	const { fuid, setFuid } = useAppStore();

	useEffect(() => {
		setFuid(null);
	}, [fuid, setFuid]);

	useLibrarySubscription();
	useUserSubscription();

	return <>{children}</>;
};
