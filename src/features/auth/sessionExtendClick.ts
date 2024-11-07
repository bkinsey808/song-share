import { sessionExtend } from "@/actions/sessionExtend";
import { actionResultType } from "@/features/app-store/consts";
import type { AppSliceGet, AppSliceSet } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";

export const sessionExtendClick =
	(get: AppSliceGet, set: AppSliceSet) => () => {
		const { signInClick } = useAppStore();
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
