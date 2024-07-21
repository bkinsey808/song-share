"use server";

import * as S from "@effect/schema/Schema";
import * as Either from "effect/Either";
import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "@/features/auth/consts";
import { decodeSessionToken } from "@/features/auth/decodeSessionToken";
import { SessionCookieDataSchema } from "@/features/auth/schemas";

export const getSessionCookieData = async () => {
	try {
		const sessionCookie = cookies().get(SESSION_COOKIE_NAME);

		if (!sessionCookie) {
			return null;
		}

		const sessionToken = sessionCookie.value;

		const payload = (await decodeSessionToken(sessionToken))?.payload;

		const result = S.decodeUnknownEither(SessionCookieDataSchema)(payload);

		if (Either.isLeft(result)) {
			throw new Error("Error decoding session token");
		}

		return result.right;
	} catch (error) {
		console.error("Error decoding session token", error);
		return null;
	}
};
