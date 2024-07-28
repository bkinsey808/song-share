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
	const { signIn, isSignedIn, lastSignInCheck, setLastSignInCheck, signOut } =
		useAuthStore();
	const { setAppModal } = useAppStore();
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

		const { sessionWarningTimestamp } = freshSessionCookieData;

		console.log({
			diff: sessionWarningTimestamp - Date.now(),
			freshSessionCookieData,
		});

		if (sessionWarningTimestamp < Date.now()) {
			setAppModal(AppModal.SESSION_EXPIRE_WARNING);
			return;
		}

		setLastSignInCheck(Date.now());
	}, [lastSignInCheck, setLastSignInCheck, signOut, setAppModal]);

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
