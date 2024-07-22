import {
	SESSION_EXPIRE_WARNING_SECONDS,
	SESSION_TIMEOUT_SECONDS,
} from "./consts";

export const getSessionWarningTimestamp = () =>
	Date.now() +
	(SESSION_TIMEOUT_SECONDS - SESSION_EXPIRE_WARNING_SECONDS) * 1000;
