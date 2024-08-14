import { actionResultType } from "../app-store/consts";
import { useAppStore } from "../app-store/useAppStore";
import { deleteAccount } from "@/actions/deleteAccount";
import { toast } from "@/components/ui/use-toast";
import { Set } from "@/features/app-store/types";

export const accountDeleteConfirmClick = (set: Set) => () => {
	void (async () => {
		set({ deletingAccount: true });
		const deleteAccountResult = await deleteAccount();

		if (deleteAccountResult.actionResultType === actionResultType.ERROR) {
			set({
				deletingAccount: false,
			});
			toast({
				variant: "destructive",
				title: "There was an error deleting your account",
			});
			useAppStore.getState().setOpenAppModal(null);

			return;
		}

		set({
			isSignedIn: false,
			deletingAccount: false,
		});
		toast({ title: "Your account has been deleted" });
		useAppStore.getState().setOpenAppModal(null);
	})();
};
