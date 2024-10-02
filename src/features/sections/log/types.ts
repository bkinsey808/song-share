import { InferOutput } from "valibot";

import { LogSchema } from "./schemas";

export type Log = InferOutput<typeof LogSchema>;
