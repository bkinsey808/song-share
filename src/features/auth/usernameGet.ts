import { Get } from "@/features/app-store/types";

export const usernameGet = (get: Get) => (uid: string) => {
	const { userLibrary, sessionCookieData } = get();

	if (uid === sessionCookieData?.uid && sessionCookieData?.username) {
		return sessionCookieData.username;
	}

	const user = userLibrary[uid];
	return user?.username ?? "";
};
