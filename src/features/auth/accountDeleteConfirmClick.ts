import { accountDelete } from "@/actions/accountDelete";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/consts";
import { AppSliceSet } from "@/features/app-store/types";
import { useAppStore } from "@/features/app-store/useAppStore";

export const accountDeleteConfirmClick = (set: AppSliceSet) => (): void => {
	void (async (): Promise<void> => {
		set({ deletingAccount: true });
		const deleteAccountResult = await accountDelete();

		if (deleteAccountResult.actionResultType === ActionResultType.ERROR) {
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
