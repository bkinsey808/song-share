import { Get } from "@/features/app-store/types";
import { getKeys } from "@/features/global/getKeys";

export const userLibraryUnsubscribe = (get: Get) => () => {
	const { userLibraryUnsubscribeFns } = get();
	const userIds = getKeys(userLibraryUnsubscribeFns);
	userIds.forEach((userId) => {
		const unsubscribeFn = userLibraryUnsubscribeFns[userId];
		unsubscribeFn();
		delete userLibraryUnsubscribeFns[userId];
	});
};
