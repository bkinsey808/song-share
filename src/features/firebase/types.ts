import { InferOutput } from "valibot";

import { UserDocSchema } from "./schemas";

export type UserDoc = InferOutput<typeof UserDocSchema>;
