import { useAppStore } from "../app-store/useAppStore";
import type { Set } from "./types";
import { extendSession } from "@/actions/extendSession";

export const extendSessionClick = (set: Set) => async () => {
	try {
		set({
			isSigningIn: true,
		});
		const result = await extendSession();

		if (result) {
			console.log({
				newtimestamp: result.sessionWarningTimestamp,
				resultDiff: result.sessionWarningTimestamp - Date.now(),
			});

			set({
				sessionCookieData: result,
				lastSignInCheck: 0,
			});
			useAppStore.setState({
				appModal: null,
			});
		}
	} catch (error) {
		console.error(error);
	}
	set({
		isSigningIn: false,
	});
};
