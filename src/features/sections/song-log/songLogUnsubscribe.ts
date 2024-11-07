import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const songLogUnsubscribe =
	(get: AppSliceGet, set: AppSliceSet) => () => {
		const { songLogUnsubscribeFn } = get();
		if (!songLogUnsubscribeFn) {
			console.warn("No song log unsubscribe function found");
			return;
		}
		songLogUnsubscribeFn();
		set({ songLogUnsubscribeFn: null });
	};
