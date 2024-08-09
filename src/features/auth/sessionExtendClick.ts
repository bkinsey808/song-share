import { ActionResultType } from "../app-store/enums";
import { useAppStore } from "../app-store/useAppStore";
import { extendSession } from "@/actions/extendSession";
import type { Get, Set } from "@/features/app-store/types";

export const sessionExtendClick = (get: Get, set: Set) => () => {
	void (async () => {
		try {
			set({
				isSigningIn: true,
			});
			const result = await extendSession();

			if (result.actionResultType === ActionResultType.SUCCESS) {
				const sessionCookieData = result.sessionCookieData;

				console.warn({
					newtimestamp: sessionCookieData.sessionWarningTimestamp,
					resultDiff: sessionCookieData.sessionWarningTimestamp - Date.now(),
				});

				set({
					sessionCookieData,
					lastSignInCheck: Date.now(),
				});
				useAppStore.getState().setAppModal(null);
			} else {
				console.error(result);
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
