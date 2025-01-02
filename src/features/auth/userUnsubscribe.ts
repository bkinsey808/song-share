import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type UserUnsubscribe = (get: AppSliceGet, set: AppSliceSet) => () => void;

export const userUnsubscribe: UserUnsubscribe = (get, set) => () => {
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
