import { signOut } from "@/actions/signOut";
import { toast } from "@/components/ui/use-toast";
import { Get, Set } from "@/features/app-store/types";

export const signOutClick = (get: Get, set: Set) => () => {
	signOut();
	const { setOpenAppModal } = get();
	set({
		isSignedIn: false,
		sessionCookieData: null,
	});

	setOpenAppModal(null);
	toast({ title: "You have been signed out" });
};
