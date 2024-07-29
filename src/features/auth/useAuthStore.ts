import { create } from "zustand";

import { AppModal } from "../app-store/enums";
import { confirmDeleteAccountClick } from "./confirmDeleteAccountClick";
import { extendSessionClick } from "./extendSessionClick";
import { registerSubmit } from "./registerSubmit";
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
	deleteAccountError: null,
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
	manageAccountClick: () => {
		useAppStore.getState().setAppModal(AppModal.MANAGE_ACCOUNT);
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
		useAppStore.getState().setAppModal(AppModal.DELETE_ACCOUNT_CONFIRM);
	},
	confirmDeleteAccountClick: confirmDeleteAccountClick(set),
	registerSubmit: registerSubmit(get, set),
	extendSessionClick: extendSessionClick(get, set),
}));
