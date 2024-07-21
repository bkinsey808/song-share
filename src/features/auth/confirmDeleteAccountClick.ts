import { useAppStore } from "../app-store/useAppStore";
import { DeleteAccountResultType } from "./enums";
import { AuthStore } from "./types";
import { deleteAccount } from "@/actions/deleteAccount";
import { toast } from "@/components/ui/use-toast";

export const confirmDeleteAccountClick =
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
			try {
				const deleteAccountResult = await deleteAccount();

				if (deleteAccountResult.result === DeleteAccountResultType.ERROR) {
					set({
						deleteAccountError: deleteAccountResult.message,
						deletingAccount: false,
					});
					toast({
						variant: "destructive",
						title: "There was an error deleting your account",
					});

					return;
				}

				set({ deleteAccountError: null });
				useAppStore.getState().setAppModal(null);
			} catch (error) {
				set({ deleteAccountError: "There was an error deleting your account" });
				toast({
					variant: "destructive",
					title: "There was an error deleting your account",
				});
			}

			set({
				isSignedIn: false,
				deletingAccount: false,
			});

			toast({ title: "Your account has been deleted" });
		})();
	};
