import { Schema as S } from "@effect/schema";
import {
	boolean,
	custom,
	minLength,
	nonEmpty,
	object,
	pipe,
	string,
} from "valibot";

import { Role } from "./enums";

const shared = {
	username: S.Union(S.String, S.Null),
	picture: S.Union(S.String, S.Null),
	roles: S.Array(S.Literal(...Object.values(Role))),
};

export const SessionCookieDataSchema = S.Struct({
	email: S.String,
	...shared,
	sessionWarningTimestamp: S.Number,
});

export const RegistrationSchema = object({
	username: pipe(
		string(),
		nonEmpty("Username is required"),
		minLength(3, "Username must be at least 3 characters"),
	),
	acceptTermsAndConditions: pipe(
		boolean(),
		custom((value) => {
			return value === true;
		}, "You must accept the terms and conditions"),
	),
});
