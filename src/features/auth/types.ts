import * as S from "@effect/schema/Schema";
import { InferOutput } from "valibot";

import { RegistrationSchema, SessionCookieDataSchema } from "./schemas";

export type SessionCookieData = S.Schema.Type<typeof SessionCookieDataSchema>;

export type RegistrationData = InferOutput<typeof RegistrationSchema>;
