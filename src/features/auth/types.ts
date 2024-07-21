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
	signIn: (sessionCookieData: SessionCookieData) => void;
	signInClick: () => void;
	manageAccountClick: () => void;
	signOutClick: () => void;
	deleteAccountError: null | string;
	deletingAccount: boolean;
	deleteAccountClick: () => void;
	confirmDeleteAccountClick: () => void;
	registerSubmit: (
		form: UseFormReturn<RegistrationData>,
	) => (e: React.FormEvent<HTMLFormElement>) => void;
};
