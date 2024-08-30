import { InferOutput } from "valibot";

import { UserLibrarySchema } from "./schemas";

export type UserLibrary = InferOutput<typeof UserLibrarySchema>;
