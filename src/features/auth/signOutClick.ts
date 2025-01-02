import { signOut } from "@/actions/signOut";
import { toast } from "@/components/ui/use-toast";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type SignOutClick = (get: AppSliceGet, set: AppSliceSet) => () => void;

export const signOutClick: SignOutClick = (get, set) => () => {
	const { sessionCookieData, fuid } = get();
	void (async (): Promise<void> => {
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
