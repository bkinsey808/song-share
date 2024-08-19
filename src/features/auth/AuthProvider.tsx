"use client";

import { ReactNode, useCallback, useEffect } from "react";

import { actionResultType } from "../app-store/consts";
import { useInterval } from "../global/useInterval";
import { AccountDeleteConfirmModal } from "./AccountDeleteConfirmModal";
import { AccountManageModal } from "./AccountManageModal";
import { RegisterModal } from "./RegisterModal";
import { SessionExpireWarningModal } from "./SessionExpireWarningModal";
import { SessionExpiredModal } from "./SessionExpiredModal";
import { SESSION_POLLING_INTERVAL_SECONDS } from "./consts";
import { sessionCookieGet } from "@/actions/sessionCookieGet";
import { useAppStore } from "@/features/app-store/useAppStore";
import "@/features/firebase/firebaseClient";
import { appModal } from "@/features/modal/consts";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const {
		setOpenAppModal,
		signIn,
		isSignedIn,
		lastSignInCheck,
		setLastSignInCheck,
		signOut,
		sessionCookieData,
	} = useAppStore();

	const handleRefresh = useCallback(async () => {
		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			signOut();
			setOpenAppModal(null);
			return;
		}

		setOpenAppModal(null);
		signIn(cookieResult.sessionCookieData);
	}, [setOpenAppModal, signIn, signOut]);

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

		const freshSessionCookieData = await sessionCookieGet();
		if (!freshSessionCookieData) {
			signOut();
			setOpenAppModal(appModal.SESSION_EXPIRED);
			return;
		}

		console.log(freshSessionCookieData);

		// console.log(
		// 	`old diff: ${(existingSessionWarningTimestamp - Date.now()) / 1000}`,
		// );

		if (existingSessionWarningTimestamp < Date.now()) {
			setOpenAppModal(appModal.SESSION_EXPIRE_WARNING);
			return;
		}

		setLastSignInCheck(Date.now());
	}, [
		lastSignInCheck,
		setLastSignInCheck,
		signOut,
		setOpenAppModal,
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
