import { Get } from "@/features/app-store/types";

export const usernameGet = (get: Get) => (uid: string) => {
	const { userLibrary, sessionCookieData, fuid, following } = get();

	if (uid === sessionCookieData?.uid && sessionCookieData?.username) {
		return sessionCookieData.username;
	}

	if (uid === fuid && following?.username) {
		return following.username;
	}

	const user = userLibrary[uid];
	return user?.username;
};
