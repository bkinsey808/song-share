import { Schema as S } from "@effect/schema";

import { UserDocSchema } from "./schemas";

export type UserDoc = S.Schema.Type<typeof UserDocSchema>;
