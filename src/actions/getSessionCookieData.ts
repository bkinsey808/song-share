"use server";

import * as S from "@effect/schema/Schema";
import * as Either from "effect/Either";
import { cookies } from "next/headers";

import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { decodeSessionToken } from "@/features/auth/decodeSessionToken";
import { SessionCookieDataSchema } from "@/features/auth/schemas";
import { getActionErrorMessage } from "@/features/global/getActionErrorMessage";

export const getSessionCookieData = async () => {
	try {
		const sessionCookie = cookies().get(SESSION_COOKIE_NAME);

		if (!sessionCookie) {
			return getActionErrorMessage("No session cookie");
		}

		const sessionToken = sessionCookie.value;

		const payload = (await decodeSessionToken(sessionToken))?.payload;

		const result = S.decodeUnknownEither(SessionCookieDataSchema)(payload);

		if (Either.isLeft(result)) {
			return getActionErrorMessage("Error decoding session token");
		}

		return {
			actionResultType: actionResultType.SUCCESS,
			sessionCookieData: result.right,
		};
	} catch (error) {
		return getActionErrorMessage("Error getting session cookie data");
	}
};
