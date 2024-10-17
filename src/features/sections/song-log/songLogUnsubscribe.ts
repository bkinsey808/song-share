import { Get, Set } from "@/features/app-store/types";

export const songLogUnsubscribe = (get: Get, set: Set) => () => {
	const { songLogUnsubscribeFn } = get();
	if (!songLogUnsubscribeFn) {
		console.warn("No song log unsubscribe function found");
		return;
	}
	songLogUnsubscribeFn();
	set({ songLogUnsubscribeFn: null });
};
