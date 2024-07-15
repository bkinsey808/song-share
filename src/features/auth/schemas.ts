import { Schema as S } from "@effect/schema";

import { SlimSongSchema } from "../music/schemas";
import { MessageKey, RegisterFormFieldKey, Role } from "./enums";

export const RegisterValuesSchema = S.Struct({
	[RegisterFormFieldKey.Username]: S.String,
	[RegisterFormFieldKey.AcceptTermsAndConditions]: S.transform(
		S.String,
		S.Boolean,
		{
			decode: (value) => value === "on",
			encode: (value) => (value ? "on" : ""),
		},
	),
});

export const RegisterErrorsSchema = S.Struct({
	[RegisterFormFieldKey.Username]: S.String.pipe(
		S.nonEmpty({ message: () => MessageKey.UsernameRequired }),
		S.filter((value) =>
			value.length < 20 ? undefined : MessageKey.UsernameMaxLength,
		),
		S.filter((value) =>
			// must not contain whitespace or non-alphanumeric characters
			/^[a-zA-Z0-9]*$/.test(value)
				? undefined
				: MessageKey.UsernameAlphanumeric,
		),
	),
	[RegisterFormFieldKey.AcceptTermsAndConditions]: S.Boolean.pipe(
		S.filter((value) =>
			value ? undefined : MessageKey.TermsAndConditionsRequired,
		),
	),
});

const shared = {
	username: S.String,
	picture: S.Union(S.String, S.Undefined),
	roles: S.Array(S.Literal(...Object.values(Role))),
};

export const SessionCookieDataSchema = S.Struct({
	email: S.String,
	...shared,
});

export const UserDataSchema = S.Struct({
	songs: S.Record(S.String, SlimSongSchema),
	...shared,
});
