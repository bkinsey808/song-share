import { useAppStore } from "../app-store/useAppStore";
import type { Get, Set } from "./types";
import { extendSession } from "@/actions/extendSession";

export const extendSessionClick = (get: Get, set: Set) => () => {
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
				useAppStore.setState({
					appModal: null,
				});
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
