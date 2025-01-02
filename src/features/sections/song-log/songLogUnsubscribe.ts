import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const songLogUnsubscribe =
	(get: AppSliceGet, set: AppSliceSet) => (): void => {
		const { songLogUnsubscribeFn } = get();
		if (!songLogUnsubscribeFn) {
			return;
		}
		songLogUnsubscribeFn();
		set({ songLogUnsubscribeFn: null });
	};
