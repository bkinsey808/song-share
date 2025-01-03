import { AppSliceGet } from "@/features/app-store/types";

type UsernameGet = (get: AppSliceGet) => (uid: string) => string | undefined;

export const usernameGet: UsernameGet = (get) => (uid) => {
	const { userLibrary, sessionCookieData, fuid, following } = get();

	if (uid === sessionCookieData?.uid && sessionCookieData?.username) {
		return sessionCookieData.username;
	}

	if (uid === fuid && following?.username) {
		return following.username;
	}

	// eslint-disable-next-line security/detect-object-injection
	const user = userLibrary[uid];
	return user?.username;
};
