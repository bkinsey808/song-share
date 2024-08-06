import { useAppSliceStore } from "../app-store/useAppStore";
import { extendSession } from "@/actions/extendSession";
import type { Get, Set } from "@/features/app-store/types";

export const sessionExtendClick = (get: Get, set: Set) => () => {
	void (async () => {
		try {
			set({
				isSigningIn: true,
			});
			const result = await extendSession();

			if (result) {
				console.warn({
					newtimestamp: result.sessionWarningTimestamp,
					resultDiff: result.sessionWarningTimestamp - Date.now(),
				});

				set({
					sessionCookieData: result,
					lastSignInCheck: Date.now(),
				});
				useAppSliceStore.getState().setAppModal(null);
			}
		} catch (error) {
			get().signOut();
			console.error(error);
		}
		set({
			isSigningIn: false,
		});
	})();
};
