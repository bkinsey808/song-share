import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { accountDeleteConfirmClick } from "./accountDeleteConfirmClick";
import { registerSubmit } from "./registerSubmit";
import { sessionExtendClick } from "./sessionExtendClick";
import { signInClick } from "./signInClick";
import { signOutAndClearLocalClick } from "./signOutAndClearLocalClick";
import { signOutClick } from "./signOutClick";
import { RegistrationData, SessionCookieData } from "./types";
import {
	AppSlice,
	sliceResetFns,
	useAppStore,
} from "@/features/app-store/useAppStore";
import "@/features/firebase/firebase";
import { appModal } from "@/features/modal/consts";

type AuthSliceState = {
	isSignedIn: boolean;
	sessionCookieData: null | SessionCookieData;
	lastSignInCheck: number;
	isSigningIn: boolean;
	registerError: null | string;
	deletingAccount: boolean;
};

const authSliceInitialState: AuthSliceState = {
	isSignedIn: false,
	sessionCookieData: null,
	deletingAccount: false,
	registerError: null,
	lastSignInCheck: 0,
	isSigningIn: false,
};

type AppAuthSlice = StateCreator<AppSlice, [], [], AuthSlice>;

export type AuthSlice = AuthSliceState & {
	setLastSignInCheck: (lastSignInCheck: number) => void;
	signIn: (sessionCookieData: SessionCookieData) => void;
	signInClick: () => void;
	accountManageClick: () => void;
	signOut: () => void;
	signOutClick: () => void;
	signOutAndClearLocalClick: () => void;
	deleteAccountClick: () => void;
	accountDeleteConfirmClick: () => void;
	registerSubmit: (
		form: UseFormReturn<RegistrationData>,
	) => (e: React.FormEvent<HTMLFormElement>) => void;
	sessionExtendClick: () => void;
};

export const createAuthSlice: AppAuthSlice = (set, get) => {
	sliceResetFns.add(() => set(authSliceInitialState));
	return {
		...authSliceInitialState,
		setLastSignInCheck: (lastSignInCheck) => set({ lastSignInCheck }),
		signIn: (sessionCookieData) => {
			set({ sessionCookieData, isSignedIn: true });
		},
		signOut: () => {
			set({ sessionCookieData: null, isSignedIn: false });
			useAppStore.getState().setOpenAppModal(null);
		},
		signInClick: signInClick(set, get),
		accountManageClick: () => {
			useAppStore.getState().setOpenAppModal(appModal.ACCOUNT_MANAGE);
		},
		signOutClick: signOutClick(get),
		signOutAndClearLocalClick: signOutAndClearLocalClick(get),
		deleteAccountClick: () => {
			useAppStore.getState().setOpenAppModal(appModal.ACCOUNT_DELETE_CONFIRM);
		},
		accountDeleteConfirmClick: accountDeleteConfirmClick(set),
		registerSubmit: registerSubmit(get, set),
		sessionExtendClick: sessionExtendClick(get, set),
	};
};
