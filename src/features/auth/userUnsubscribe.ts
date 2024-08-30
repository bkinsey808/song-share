import { Get, Set } from "@/features/app-store/types";

export const userUnsubscribe = (get: Get, set: Set) => () => {
	const { userUnsubscribeFn, userPublicUnsubscribeFn } = get();
	if (!userUnsubscribeFn) {
		console.warn("No user unsubscribe function found");
		return;
	}
	if (!userPublicUnsubscribeFn) {
		console.warn("No user public unsubscribe function found");
		return;
	}
	userUnsubscribeFn();
	userPublicUnsubscribeFn();
	set({ userUnsubscribeFn: null, userPublicUnsubscribeFn: null });
};
