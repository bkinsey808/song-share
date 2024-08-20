import { signOut } from "@/actions/signOut";
import { toast } from "@/components/ui/use-toast";
import { Get } from "@/features/app-store/types";

export const signOutClick = (get: Get) => () => {
	signOut();
	const { setOpenAppModal } = get();
	setOpenAppModal(null);
	toast({ title: "You have been signed out" });
};
