"use client";

import { ReactNode, useCallback, useEffect } from "react";

import { useInterval } from "../global/useInterval";
import { AccountDeleteConfirmModal } from "./AccountDeleteConfirmModal";
import { AccountManageModal } from "./AccountManageModal";
import { RegisterModal } from "./RegisterModal";
import { SessionExpireWarningModal } from "./SessionExpireWarningModal";
import { SessionExpiredModal } from "./SessionExpiredModal";
import { SESSION_POLLING_INTERVAL_SECONDS } from "./consts";
import { getSessionCookieData } from "@/actions/getSessionCookieData";
import { useAppSliceStore } from "@/features/app-store/useAppStore";
import { AppModal } from "@/features/modal/enums";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const {
		setAppModal,
		signIn,
		isSignedIn,
		lastSignInCheck,
		setLastSignInCheck,
		signOut,
		sessionCookieData,
	} = useAppSliceStore();
	const handleRefresh = useCallback(async () => {
		const refreshSessionCookieData = await getSessionCookieData();

		if (refreshSessionCookieData) {
			setAppModal(null);
			signIn(refreshSessionCookieData);
		} else {
			signOut();
			setAppModal(null);
		}
	}, [setAppModal, signIn, signOut]);

	const existingSessionWarningTimestamp =
		sessionCookieData?.sessionWarningTimestamp ?? 0;

	// handle refresh
	useEffect(() => {
		void handleRefresh();
	}, [handleRefresh]);

	const intervalFn = useCallback(async () => {
		// we only need to poll if we haven't recently checked
		if (
			Date.now() - lastSignInCheck <
			SESSION_POLLING_INTERVAL_SECONDS * 1000
		) {
			return;
		}

		const freshSessionCookieData = await getSessionCookieData();
		if (!freshSessionCookieData) {
			signOut();
			setAppModal(AppModal.SESSION_EXPIRED);
			return;
		}

		console.log(
			`old diff: ${(existingSessionWarningTimestamp - Date.now()) / 1000}`,
		);

		if (existingSessionWarningTimestamp < Date.now()) {
			setAppModal(AppModal.SESSION_EXPIRE_WARNING);
			return;
		}

		setLastSignInCheck(Date.now());
	}, [
		lastSignInCheck,
		setLastSignInCheck,
		signOut,
		setAppModal,
		existingSessionWarningTimestamp,
	]);

	useInterval(
		() => {
			void intervalFn();
		},
		isSignedIn ? SESSION_POLLING_INTERVAL_SECONDS * 1000 : null,
	);

	return (
		<>
			<AccountManageModal />
			<AccountDeleteConfirmModal />
			<RegisterModal />
			<SessionExpiredModal />
			<SessionExpireWarningModal />

			{children}
		</>
	);
};
