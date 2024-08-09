import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { accountDeleteConfirmClick } from "./accountDeleteConfirmClick";
import { registerSubmit } from "./registerSubmit";
import { sessionExtendClick } from "./sessionExtendClick";
import { signInClick } from "./signInClick";
import { RegistrationData, SessionCookieData } from "./types";
import { signOut } from "@/actions/signOut";
import { toast } from "@/components/ui/use-toast";
import { AppSlice, useAppStore } from "@/features/app-store/useAppStore";
import "@/features/firebase/firebase";
import { AppModal } from "@/features/modal/enums";

export type AuthSlice = {
	isSignedIn: boolean;
	sessionCookieData: null | SessionCookieData;
	lastSignInCheck: number;
	isSigningIn: boolean;
  registerError: null | string;
	setLastSignInCheck: (lastSignInCheck: number) => void;
	signIn: (sessionCookieData: SessionCookieData) => void;
	signInClick: () => void;
	accountManageClick: () => void;
	signOut: () => void;
	signOutClick: () => void;
	deletingAccount: boolean;
	deleteAccountClick: () => void;
	accountDeleteConfirmClick: () => void;
	registerSubmit: (
		form: UseFormReturn<RegistrationData>,
	) => (e: React.FormEvent<HTMLFormElement>) => void;
	sessionExtendClick: () => void;
};

type AppAuthSlice = StateCreator<AppSlice, [], [], AuthSlice>;

export const createAuthSlice: AppAuthSlice = (set, get) => ({
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
	signInClick: signInClick(set, get),
	accountManageClick: () => {
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
});
