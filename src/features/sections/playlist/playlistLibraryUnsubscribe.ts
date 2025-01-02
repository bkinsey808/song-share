import { AppSliceGet } from "@/features/app-store/types";
import { getKeys } from "@/features/global/getKeys";

type PlaylistLibraryUnsubscribe = (get: AppSliceGet) => () => void;

export const playlistLibraryUnsubscribe: PlaylistLibraryUnsubscribe =
	(get) => () => {
		const { playlistUnsubscribeFns } = get();
		const playlistIds = getKeys(playlistUnsubscribeFns);
		playlistIds.forEach((playlistId) => {
			const unsubscribeFn = playlistUnsubscribeFns[playlistId];
			unsubscribeFn();
		});
	};
