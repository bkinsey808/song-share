"use server";

import { cookies } from "next/headers";

import { getSessionCookieData } from "./getSessionCookieData";
import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { encodeSessionToken } from "@/features/auth/encodeSessionToken";
import { getSessionWarningTimestamp } from "@/features/auth/getSessionWarningTimestamp";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { SessionCookieData } from "@/features/auth/types";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";

export const extendSession = async () => {
	try {
		const cookieResult = await getSessionCookieData();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return getActionErrorMessage("Session expired");
		}

		const sessionCookieData = cookieResult.sessionCookieData;

		const sessionWarningTimestamp = getSessionWarningTimestamp();

		// Extend the session
		const newSessionCookieData: SessionCookieData = {
			...sessionCookieData,
			sessionWarningTimestamp,
		};

		const sessionToken = await encodeSessionToken(sessionCookieData);

		cookies().set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

		return {
			actionResultType: actionResultType.SUCCESS,
			sessionCookieData: newSessionCookieData,
		};
	} catch (error) {
		return getActionErrorMessage("Error getting session");
	}
};
