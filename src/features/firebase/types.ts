import { InferOutput } from "valibot";

import { PublicUserDocSchema, UserDocSchema } from "./schemas";

export type UserDoc = InferOutput<typeof UserDocSchema>;
export type PublicUserDoc = InferOutput<typeof PublicUserDocSchema>;
