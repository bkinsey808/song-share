import { jwtVerify } from "jose";

const sessionPrivateKey = process.env.SESSION_PRIVATE_KEY;

export const decodeSessionToken = async (sessionToken: string) => {
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
