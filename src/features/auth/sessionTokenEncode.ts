import { JWTPayload, SignJWT } from "jose";

import { SessionCookieData } from "./types";

const sessionPrivateKey = process.env.SESSION_PRIVATE_KEY;

export const sessionTokenEncode = async (
	sessionCookieData: SessionCookieData,
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
