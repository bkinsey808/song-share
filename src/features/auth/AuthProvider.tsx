"use client";

import { ReactNode, useCallback, useEffect } from "react";

import { AppModal } from "../app-store/enums";
import { useAppStore } from "../app-store/useAppStore";
import { useInterval } from "../global/useInterval";
import { DeleteAccountConfirmModal } from "./DeleteAccountConfirmModal";
import { ManageAccountModal } from "./ManageAccountModal";
import { RegisterModal } from "./RegisterModal";
import { SessionExpireWarningModal } from "./SessionExpireWarningModal";
import { SessionExpiredModal } from "./SessionExpiredModal";
import { SESSION_POLLING_INTERVAL_SECONDS } from "./consts";
import { useAuthStore } from "./useAuthStore";
import { getSessionCookieData } from "@/actions/getSessionCookieData";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const {
		signIn,
		isSignedIn,
		lastSignInCheck,
		setLastSignInCheck,
		signOut,
		sessionCookieData,
	} = useAuthStore();
	const { setAppModal } = useAppStore();
	const handleRefresh = useCallback(async () => {
		const sessionCookieData = await getSessionCookieData();

		if (sessionCookieData) {
			signIn(sessionCookieData);
		}
	}, [signIn]);

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

		if (!freshSessionCookieData || !sessionCookieData) {
			signOut();
			setAppModal(AppModal.SESSION_EXPIRED);
			return;
		}

		const { sessionWarningTimestamp } = sessionCookieData;

		if (sessionWarningTimestamp < Date.now()) {
			setAppModal(AppModal.SESSION_EXPIRE_WARNING);
			return;
		}

		signIn(freshSessionCookieData);
		setLastSignInCheck(Date.now());
	}, [
		lastSignInCheck,
		setLastSignInCheck,
		signIn,
		signOut,
		setAppModal,
		sessionCookieData,
	]);

	useInterval(
		() => {
			void intervalFn();
		},
		isSignedIn ? SESSION_POLLING_INTERVAL_SECONDS * 1000 : null,
	);

	return (
		<>
			<ManageAccountModal />
			<DeleteAccountConfirmModal />
			<RegisterModal />
			<SessionExpiredModal />
			<SessionExpireWarningModal />

			{children}
		</>
	);
};
