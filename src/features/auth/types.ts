import { Schema as S } from "@effect/schema";
import { UseFormReturn } from "react-hook-form";
import { InferOutput } from "valibot";

import { RegistrationSchema, SessionCookieDataSchema } from "./schemas";

export type SessionCookieData = S.Schema.Type<typeof SessionCookieDataSchema>;

export type RegistrationData = InferOutput<typeof RegistrationSchema>;

export type Get = () => AuthStore;
export type Set = (
	partial:
		| AuthStore
		| Partial<AuthStore>
		| ((state: AuthStore) => AuthStore | Partial<AuthStore>),
	replace?: boolean | undefined,
) => void;

export type AuthStore = {
	isSignedIn: boolean;
	sessionCookieData: null | SessionCookieData;
	lastSignInCheck: number;
	isSigningIn: boolean;
	setLastSignInCheck: (lastSignInCheck: number) => void;
	signIn: (sessionCookieData: SessionCookieData) => void;
	signInClick: () => void;
	acocuntManageClick: () => void;
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
