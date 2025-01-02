import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

/**
 *  If a cookie presents the Max-Age (that has preference over
 * Expires) or Expires attributes, it will be considered a
 * persistent cookie and will be stored on disk by the web
 * browser based until the expiration time.
 *
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#expire-and-max-age-attributes
 *
 * Cookies in chrome have a max-age limit:
 * @see https://developer.chrome.com/blog/cookie-max-age-expires#:~:text=With%20this%20change%2C%20Chrome%20caps,set%20to%20400%20days%20instead.
 *
 * max-age is not the same as session expiration time.
 * It is the time in seconds that the cookie will be stored.
 */
export const sessionCookieOptions: Partial<ResponseCookie> = {
	maxAge: 60 * 60 * 24 * 7, // 1 week for session cookie
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "strict" as ResponseCookie["sameSite"],
	path: "/",
};
