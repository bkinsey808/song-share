import { InferOutput } from "valibot";

import { UserLibrarySchema, UserSchema } from "./schemas";

export type User = InferOutput<typeof UserSchema>;
export type UserLibrary = InferOutput<typeof UserLibrarySchema>;
