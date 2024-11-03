import { signOut } from "@/actions/signOut";
import { Get } from "@/features/app-store/types";
import { resetAllSlices } from "@/features/app-store/useAppStore";
import { wait } from "@/features/global/wait";

export const signOutAndClearLocalClick = (get: Get) => () => {
	const { sessionCookieData, fuid } = get();
	void (async () => {
		await signOut({ uid: sessionCookieData?.uid ?? null, fuid });
		const { setOpenAppModal } = get();
		setOpenAppModal(null);
		resetAllSlices();
		await wait(0);
		location.reload();
	})();
};
