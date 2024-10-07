import { InferOutput } from "valibot";

import { LogFormSchema, LogSchema } from "./schemas";

export type Log = InferOutput<typeof LogSchema>;

export type LogForm = InferOutput<typeof LogFormSchema>;
