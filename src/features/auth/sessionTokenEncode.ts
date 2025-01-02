import { JWTPayload, SignJWT } from "jose";

import { SessionCookieData } from "./types";

const sessionPrivateKey = process.env.SESSION_PRIVATE_KEY;

type SessionTokenEncode = (
	sessionCookieData: SessionCookieData,
) => Promise<string>;

export const sessionTokenEncode: SessionTokenEncode = async (
	sessionCookieData,
) => {
	if (!sessionPrivateKey) {
		throw new Error("SESSION_PRIVATE_KEY is not defined");
	}

	const jwtKey = new TextEncoder().encode(sessionPrivateKey);

	const sessionToken = await new SignJWT(
		sessionCookieData as unknown as JWTPayload,
	)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("1w")
		.sign(jwtKey);

	return sessionToken;
};
