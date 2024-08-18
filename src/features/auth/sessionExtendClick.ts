import { actionResultType } from "../app-store/consts";
import { useAppStore } from "../app-store/useAppStore";
import { sessionExtend } from "@/actions/sessionExtend";
import type { Get, Set } from "@/features/app-store/types";

export const sessionExtendClick = (get: Get, set: Set) => () => {
	void (async () => {
		try {
			set({
				isSigningIn: true,
			});
			const result = await sessionExtend();

			if (result.actionResultType === actionResultType.SUCCESS) {
				const sessionCookieData = result.sessionCookieData;

				console.warn({
					newtimestamp: sessionCookieData.sessionWarningTimestamp,
					resultDiff: sessionCookieData.sessionWarningTimestamp - Date.now(),
				});

				set({
					sessionCookieData,
					lastSignInCheck: Date.now(),
				});
				useAppStore.getState().setOpenAppModal(null);
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
