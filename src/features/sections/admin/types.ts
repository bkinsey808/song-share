import { InferOutput } from "valibot";

import { BackUpFormSchema } from "./schemas";

export type BackUpForm = InferOutput<typeof BackUpFormSchema>;
