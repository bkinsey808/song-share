"use server";

import * as S from "@effect/schema/Schema";
import * as Either from "effect/Either";
import { cookies } from "next/headers";

import { actionResultType } from "@/features/app-store/consts";
import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { SessionCookieDataSchema } from "@/features/auth/schemas";
import { sessionTokenDecode } from "@/features/auth/sessionTokenDecode";
import { actionErrorMessageGet } from "@/features/global/actionErrorMessageGet";

export const sessionCookieGet = async () => {
	try {
		const sessionCookie = cookies().get(SESSION_COOKIE_NAME);

		if (!sessionCookie) {
			return actionErrorMessageGet("No session cookie");
		}

		const sessionToken = sessionCookie.value;

		const payload = (await sessionTokenDecode(sessionToken))?.payload;

		const result = S.decodeUnknownEither(SessionCookieDataSchema)(payload);

		if (Either.isLeft(result)) {
			return actionErrorMessageGet("Error decoding session token");
		}

		return {
			actionResultType: actionResultType.SUCCESS,
			sessionCookieData: result.right,
		};
	} catch (error) {
		return actionErrorMessageGet("Error getting session cookie data");
	}
};