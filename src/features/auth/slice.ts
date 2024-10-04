import { Unsubscribe } from "firebase/auth";
import { UseFormReturn } from "react-hook-form";
import { StateCreator } from "zustand";

import { accountDeleteConfirmClick } from "./accountDeleteConfirmClick";
import { registerSubmit } from "./registerSubmit";
import { sessionExtendClick } from "./sessionExtendClick";
import { signInClick } from "./signInClick";
import { signOutAndClearLocalClick } from "./signOutAndClearLocalClick";
import { signOutClick } from "./signOutClick";
import { RegistrationData, SessionCookieData } from "./types";
import { userUnsubscribe } from "./userUnsubscribe";
import { userUpdate } from "./userUpdate";
import { usernameGet } from "./usernameGet";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";
import "@/features/firebase/firebaseClient";
import { appModal } from "@/features/modal/consts";

type AuthSliceState = {
	isSignedIn: boolean;
	sessionCookieData: null | SessionCookieData;
	lastSignInCheck: number;
	isSigningIn: boolean;
	registerError: null | string;
	deletingAccount: boolean;
	userUnsubscribeFn: Unsubscribe | null;
	userPublicUnsubscribeFn: Unsubscribe | null;
	timeZone: string | null;
};

const authSliceInitialState: AuthSliceState = {
	isSignedIn: false,
	sessionCookieData: null,
	deletingAccount: false,
	registerError: null,
	lastSignInCheck: 0,
	isSigningIn: false,
	userUnsubscribeFn: null,
	userPublicUnsubscribeFn: null,
	timeZone: null,
};

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
	usernameGet: (uid: string) => string;
	userUpdate: (uid: string) => void;
	userUnsubscribe: () => void;
};

type AppAuthSlice = StateCreator<AppSlice, [], [], AuthSlice>;

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
			const { setOpenAppModal } = get();
			setOpenAppModal(null);
		},
		signInClick: signInClick(set, get),
		accountManageClick: () => {
			const { setOpenAppModal } = get();
			setOpenAppModal(appModal.ACCOUNT_MANAGE);
		},
		signOutClick: signOutClick(get, set),
		signOutAndClearLocalClick: signOutAndClearLocalClick(get),
		deleteAccountClick: () => {
			const { setOpenAppModal } = get();
			setOpenAppModal(appModal.ACCOUNT_DELETE_CONFIRM);
		},
		accountDeleteConfirmClick: accountDeleteConfirmClick(set),
		registerSubmit: registerSubmit(get, set),
		sessionExtendClick: sessionExtendClick(get, set),
		usernameGet: usernameGet(get),
		userUpdate: userUpdate(get, set),
		userUnsubscribe: userUnsubscribe(get, set),
	};
};
