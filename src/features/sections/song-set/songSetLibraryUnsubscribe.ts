import { Get } from "@/features/app-store/types";
import { getKeys } from "@/features/global/getKeys";

export const songSetLibraryUnsubscribe = (get: Get) => () => {
	const { songSetUnsubscribeFns } = get();
	const songSetIds = getKeys(songSetUnsubscribeFns);
	songSetIds.forEach((songSetId) => {
		const unsubscribeFn = songSetUnsubscribeFns[songSetId];
		unsubscribeFn();
	});
};
