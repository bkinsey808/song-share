import { AppSliceGet } from "@/features/app-store/types";
import { getKeys } from "@/features/global/getKeys";

export const songLibraryUnsubscribe = (get: AppSliceGet) => (): void => {
	const { songUnsubscribeFns } = get();
	const songIds = getKeys(songUnsubscribeFns);
	songIds.forEach((songId) => {
		const unsubscribeFn = songUnsubscribeFns[songId];
		unsubscribeFn();
		delete songUnsubscribeFns[songId];
	});
};
