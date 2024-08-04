import { create } from "zustand";

import { AppModal } from "../app-store/enums";
import { accountDeleteConfirmClick } from "./accountDeleteConfirmClick";
import { registerSubmit } from "./registerSubmit";
import { sessionExtendClick } from "./sessionExtendClick";
import { signInClick } from "./signInClick";
import { AuthStore } from "./types";
import { signOut } from "@/actions/signOut";
import { toast } from "@/components/ui/use-toast";
import { useAppStore } from "@/features/app-store/useAppStore";
import "@/features/firebase/firebase";

export const useAuthStore = create<AuthStore>()((set, get) => ({
	isSignedIn: false,
	sessionCookieData: null,
	deletingAccount: false,
	registerError: null,
	lastSignInCheck: 0,
	isSigningIn: false,
	setLastSignInCheck: (lastSignInCheck) => set({ lastSignInCheck }),
	signIn: (sessionCookieData) => {
		set({ sessionCookieData, isSignedIn: true });
	},
	signOut: () => {
		set({ sessionCookieData: null, isSignedIn: false });
		useAppStore.getState().setAppModal(null);
	},
	signInClick: signInClick(set),
	acocuntManageClick: () => {
		useAppStore.getState().setAppModal(AppModal.ACCOUNT_MANAGE);
	},
	signOutClick: () => {
		signOut();
		set({
			isSignedIn: false,
			sessionCookieData: null,
		});
		useAppStore.getState().setAppModal(null);
		toast({ title: "You have been signed out" });
	},
	deleteAccountClick: () => {
		useAppStore.getState().setAppModal(AppModal.ACCOUNT_DELETE_CONFIRM);
	},
	accountDeleteConfirmClick: accountDeleteConfirmClick(set),
	registerSubmit: registerSubmit(get, set),
	sessionExtendClick: sessionExtendClick(get, set),
}));
