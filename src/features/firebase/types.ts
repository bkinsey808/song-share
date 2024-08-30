import { InferOutput } from "valibot";

import { UserDocSchema, UserPublicDocSchema } from "./schemas";

export type UserDoc = InferOutput<typeof UserDocSchema>;
export type UserPublicDoc = InferOutput<typeof UserPublicDocSchema>;
