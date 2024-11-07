import { AppSliceGet } from "@/features/app-store/types";
import { getKeys } from "@/features/global/getKeys";

export const playlistLibraryUnsubscribe = (get: AppSliceGet) => () => {
	const { playlistUnsubscribeFns } = get();
	const playlistIds = getKeys(playlistUnsubscribeFns);
	playlistIds.forEach((playlistId) => {
		const unsubscribeFn = playlistUnsubscribeFns[playlistId];
		unsubscribeFn();
	});
};
