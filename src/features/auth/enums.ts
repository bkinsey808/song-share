export enum RegisterFormFieldKey {
	Username = "username",
	AcceptTermsAndConditions = "acceptTermsAndConditions",
}

export enum MessageKey {
	UsernameRequired = "Username required",
	UsernameMaxLength = "Username must be less than 20 characters",
	UsernameAlphanumeric = "Username must only contain alphanumeric characters",
	TermsAndConditionsRequired = "You must accept the terms and conditions",
}

export const enum SignInResultType {
	NEW = "NEW",
	EXISTING = "EXISTING",
	ERROR = "ERROR",
}

export enum RegisterResult {
	ERROR = "ERROR",
	SUCCESS = "SUCCESS",
}

export enum DeleteAccountResult {
	ERROR = "ERROR",
	SUCCESS = "SUCCESS",
}

export enum AuthModal {
	REGISTER = "REGISTER",
	DELETE_ACCOUNT_CONFIRM = "DELETE_ACCOUNT_CONFIRM",
	MANAGE_ACCOUNT = "MANAGE_ACCOUNT",
	SESSION_EXPIRED = "SESSION_EXPIRED",
}

export enum Role {
	ADMIN = "ADMIN",
	USER = "USER",
}
