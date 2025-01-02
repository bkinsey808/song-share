"use client";

import { JSX, ReactNode, useEffect } from "react";

import { useUserLibrarySubscription } from "../sections/user-library/useUserLibrarySubscription";
import { useAppStore } from "@/features/app-store/useAppStore";
import { useUserSubscription } from "@/features/auth/useUserSubscription";
import { useLibrarySubscription } from "@/features/firebase/useLibrarySubscription";
import { ConfirmModal } from "@/features/modal/ConfirmModal";
import { useSongLogSubscription } from "@/features/sections/song-log/useSongLogSubscription";

export const DashboardProvider = ({
	children,
}: {
	readonly children: ReactNode;
}): JSX.Element => {
	const { fuid, setFuid } = useAppStore();

	useEffect(() => {
		setFuid(null);
	}, [fuid, setFuid]);

	useLibrarySubscription();
	useUserSubscription();
	useSongLogSubscription();
	useUserLibrarySubscription();

	return (
		<>
			<ConfirmModal />
			{children}
		</>
	);
};
