"use client";

import { ReactNode, useEffect } from "react";

import { ConfirmModal } from "../modal/ConfirmModal";
import { useSongLogSubscription } from "../sections/song-log/useSongLogSubscription";
import { useAppStore } from "@/features/app-store/useAppStore";
import { useUserSubscription } from "@/features/auth/useUserSubscription";
import { useLibrarySubscription } from "@/features/firebase/useLibrarySubscription";

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
	const { fuid, setFuid } = useAppStore();

	useEffect(() => {
		setFuid(null);
	}, [fuid, setFuid]);

	useLibrarySubscription();
	useUserSubscription();
	useSongLogSubscription();

	return (
		<>
			<ConfirmModal />
			{children}
		</>
	);
};
