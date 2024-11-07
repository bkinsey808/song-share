import { signOut } from "@/actions/signOut";
import { toast } from "@/components/ui/use-toast";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const signOutClick = (get: AppSliceGet, set: AppSliceSet) => () => {
	const { sessionCookieData, fuid } = get();
	void (async () => {
		await signOut({ uid: sessionCookieData?.uid ?? null, fuid });
		const { setOpenAppModal } = get();
		set({
			isSignedIn: false,
			sessionCookieData: null,
		});

		setOpenAppModal(null);
		toast({ title: "You have been signed out" });
	})();
};
