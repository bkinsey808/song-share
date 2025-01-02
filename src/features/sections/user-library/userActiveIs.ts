import { AppSliceGet } from "@/features/app-store/types";

export const userActiveIs =
	(get: AppSliceGet) =>
	(uid: string): boolean => {
		const { usersActive } = get();

		if (!usersActive?.[uid]) {
			return false;
		}

		const lastActiveIso = usersActive[uid];
		// return true if user has been active in past 3 hours
		return Date.now() - new Date(lastActiveIso).getTime() < 3 * 60 * 60 * 1000;
	};
