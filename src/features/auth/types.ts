import { Schema as S } from "@effect/schema";

import {
	RegisterValuesSchema,
	SessionCookieDataSchema,
	UserDataSchema,
} from "./schemas";

export interface SignInData {
	email: string;
	picture?: string | undefined;
}

export type RegisterValues = S.Schema.Type<typeof RegisterValuesSchema>;

export type UserData = S.Schema.Type<typeof UserDataSchema>;

export type SessionCookieData = S.Schema.Type<typeof SessionCookieDataSchema>;
