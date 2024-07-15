import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

import { SESSION_TIMEOUT_SECONDS } from "./consts";

export const getSessionCookieOptions = () => ({
	maxAge: SESSION_TIMEOUT_SECONDS,
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict" as ResponseCookie["sameSite"],
	path: "/",
});
