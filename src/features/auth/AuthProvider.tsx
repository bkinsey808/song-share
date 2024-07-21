"use client";

import { ReactNode, useCallback, useEffect } from "react";

import { useAuthStore } from "./useAuthStore";
import { getSessionCookieData } from "@/actions/getSessionCookieData";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { signIn } = useAuthStore();
	const handleRefresh = useCallback(async () => {
		console.log("handle refresh calleds");
		const sessionCookieData = await getSessionCookieData();
		console.log({ sessionCookieData });
		if (sessionCookieData) {
			signIn(sessionCookieData);
		}
	}, [signIn]);

	useEffect(() => {
		void handleRefresh();
	}, [handleRefresh]);

	return children;
};
