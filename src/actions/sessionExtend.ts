"use server";

import { cookies } from "next/headers";

import { sessionCookieGet } from "./sessionCookieGet";
import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { sessionTokenEncode } from "@/features/auth/sessionTokenEncode";
import { sessionWarningTimestampGet } from "@/features/auth/sessionWarningTimestampGet";
import { SessionCookieData } from "@/features/auth/types";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

export const sessionExtend = async () => {
	try {
		const cookieResult = await sessionCookieGet();

		if (cookieResult.actionResultType === actionResultType.ERROR) {
			return actionErrorMessageGet("Session expired");
		}

		const sessionCookieData = cookieResult.sessionCookieData;

		const sessionWarningTimestamp = sessionWarningTimestampGet();

		// Extend the session
		const newSessionCookieData: SessionCookieData = {
			...sessionCookieData,
			sessionWarningTimestamp,
		};

		const sessionToken = await sessionTokenEncode(sessionCookieData);

		(await cookies()).set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

		return {
			actionResultType: actionResultType.SUCCESS,
			sessionCookieData: newSessionCookieData,
		};
	} catch (error) {
		return actionErrorMessageGet("Error getting session");
	}
};
