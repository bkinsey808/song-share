"use server";

import { cookies } from "next/headers";

import { getSessionCookieData } from "./getSessionCookieData";
import { ActionResultType } from "@/features/app-store/enums";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { encodeSessionToken } from "@/features/auth/encodeSessionToken";
import { getSessionWarningTimestamp } from "@/features/auth/getSessionWarningTimestamp";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { SessionCookieData } from "@/features/auth/types";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";

export const extendSession = async () => {
	try {
		const sessionCookieData = await getSessionCookieData();

		if (!sessionCookieData) {
			return getActionErrorMessage("Session cookie data is not defined");
		}

		if (!sessionCookieData.email) {
			return getActionErrorMessage("Session cookie missing data");
		}

		const sessionWarningTimestamp = getSessionWarningTimestamp();

		// Extend the session
		const newSessionCookieData: SessionCookieData = {
			...sessionCookieData,
			sessionWarningTimestamp,
		};

		const sessionToken = await encodeSessionToken(sessionCookieData);

		cookies().set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

		return {
			actionResultType: ActionResultType.SUCCESS,
			sessionCookieData: newSessionCookieData,
		};
	} catch (error) {
		return getActionErrorMessage("Error getting session");
	}
};
