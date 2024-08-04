import { ActionResultType } from "../app-store/enums";
import { useAppStore } from "../app-store/useAppStore";
import { AuthStore } from "./types";
import { deleteAccount } from "@/actions/deleteAccount";
import { toast } from "@/components/ui/use-toast";

export const accountDeleteConfirmClick =
	(
		set: (
			partial:
				| AuthStore
				| Partial<AuthStore>
				| ((state: AuthStore) => AuthStore | Partial<AuthStore>),
			replace?: boolean | undefined,
		) => void,
	) =>
	() => {
		void (async () => {
			set({ deletingAccount: true });
			const deleteAccountResult = await deleteAccount();

			if (deleteAccountResult.actionResultType === ActionResultType.ERROR) {
				set({
					deletingAccount: false,
				});
				toast({
					variant: "destructive",
					title: "There was an error deleting your account",
				});
				useAppStore.getState().setAppModal(null);
				return;
			}

			set({
				isSignedIn: false,
				deletingAccount: false,
			});
			toast({ title: "Your account has been deleted" });
			useAppStore.getState().setAppModal(null);
		})();
	};
