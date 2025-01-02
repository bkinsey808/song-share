import { sessionExtend } from "@/actions/sessionExtend";
import { ActionResultType } from "@/features/app-store/consts";
import type { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";

type SessionExtendClick = (get: AppSliceGet, set: AppSliceSet) => () => void;

export const sessionExtendClick: SessionExtendClick = (get, set) => () => {
	const { signInClick } = useAppStore();
	void (async (): Promise<void> => {
		try {
			set({
				isSigningIn: true,
			});
			const result = await sessionExtend();

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
				useAppStore.getState().setOpenAppModal(null);
			} else {
				console.error(result);
				signInClick();
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
