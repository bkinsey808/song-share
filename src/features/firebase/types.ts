import { InferOutput } from "valibot";

import { collection } from "./consts";
import { UserDocSchema, UserPublicDocSchema } from "./schemas";

export type UserDoc = InferOutput<typeof UserDocSchema>;
export type UserPublicDoc = InferOutput<typeof UserPublicDocSchema>;

export type Collection = (typeof collection)[keyof typeof collection];
