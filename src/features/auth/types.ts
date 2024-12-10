import * as S from "@effect/schema/Schema";
import { InferOutput } from "valibot";

import { role } from "./consts";
import { RegistrationSchema, SessionCookieDataSchema } from "./schemas";

export type SessionCookieData = S.Schema.Type<typeof SessionCookieDataSchema>;

export type RegistrationData = InferOutput<typeof RegistrationSchema>;

export type Role = (typeof role)[keyof typeof role];
