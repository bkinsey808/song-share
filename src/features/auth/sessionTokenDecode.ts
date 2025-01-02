import { JWTPayload, JWTVerifyResult, jwtVerify } from "jose";

const sessionPrivateKey = process.env.SESSION_PRIVATE_KEY;

type SessionTokenDecode = (
	sessionToken: string,
) => Promise<JWTVerifyResult<JWTPayload> | null>;

export const sessionTokenDecode: SessionTokenDecode = async (
	sessionToken: string,
) => {
	try {
		if (!sessionPrivateKey) {
			throw new Error("SESSION_PRIVATE_KEY is not defined");
		}

		const jwtKey = new TextEncoder().encode(sessionPrivateKey);

		return await jwtVerify(sessionToken, jwtKey, {
			algorithms: ["HS256"],
		});
	} catch (error) {
		console.error("Error decoding session token", error);
		return null;
	}
};
