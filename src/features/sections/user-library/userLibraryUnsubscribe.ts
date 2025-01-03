import { AppSliceGet } from "@/features/app-store/types";
import { getKeys } from "@/features/global/getKeys";

type UserLibraryUnsubscribe = (get: AppSliceGet) => () => void;

export const userLibraryUnsubscribe: UserLibraryUnsubscribe = (get) => () => {
	const { userLibraryUnsubscribeFns } = get();
	const userIds = getKeys(userLibraryUnsubscribeFns);
	userIds.forEach((userId) => {
		const unsubscribeFn = userLibraryUnsubscribeFns[userId];
		unsubscribeFn();
		delete userLibraryUnsubscribeFns[userId];
	});
};
