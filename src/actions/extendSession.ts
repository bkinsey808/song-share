"use server";

import { cookies } from "next/headers";

import { getSessionCookieData } from "./getSessionCookieData";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { encodeSessionToken } from "@/features/auth/encodeSessionToken";
import { getSessionWarningTimestamp } from "@/features/auth/getSessionWarningTimestamp";
import { sessionCookieOptions } from "@/features/auth/sessionCookieOptions";
import { SessionCookieData } from "@/features/auth/types";

export const extendSession = async () => {
	try {
		const sessionCookieData = await getSessionCookieData();
		if (!sessionCookieData) {
			throw new Error("Session cookie data is not defined");
		}

		const sessionWarningTimestamp = getSessionWarningTimestamp();

		// Extend the session
		const newSessionCookieData: SessionCookieData = {
			...sessionCookieData,
			sessionWarningTimestamp,
		};

		const sessionToken = await encodeSessionToken(sessionCookieData);

		cookies().set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);

		return newSessionCookieData;
	} catch (error) {
		console.error(error);
	}
};
