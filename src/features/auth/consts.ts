export const SESSION_TIMEOUT_SECONDS = 4 * 60 * 60; // 4 hours
export const SESSION_POLLING_INTERVAL_SECONDS = 60;
/** amount of warning before session expires */
export const SESSION_EXPIRE_WARNING_SECONDS = 45;
export const SESSION_COOKIE_NAME = "session";

export const registerFormFieldKey = {
	Username: "username",
	AcceptTermsAndConditions: "acceptTermsAndConditions",
} as const;

export const signInResultType = {
	NEW: "NEW",
	EXISTING: "EXISTING",
	ERROR: "ERROR",
} as const;

export const role = {
	ADMIN: "ADMIN",
	USER: "USER",
} as const;
