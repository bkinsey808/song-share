import { accountDelete } from "@/actions/accountDelete";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { AppSliceSet } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";

export const accountDeleteConfirmClick = (set: AppSliceSet) => () => {
	void (async () => {
		set({ deletingAccount: true });
		const deleteAccountResult = await accountDelete();

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
			sessionCookieData: null,
		});
		toast({ title: "Your account has been deleted" });
		useAppStore.getState().setOpenAppModal(null);
	})();
};
