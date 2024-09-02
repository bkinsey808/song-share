import { Get } from "@/features/app-store/types";
import { getKeys } from "@/features/global/getKeys";

export const songLibraryUnsubscribe = (get: Get) => () => {
	const { songUnsubscribeFns } = get();
	const songIds = getKeys(songUnsubscribeFns);
	songIds.forEach((songId) => {
		const unsubscribeFn = songUnsubscribeFns[songId];
		unsubscribeFn();
		delete songUnsubscribeFns[songId];
	});
};
