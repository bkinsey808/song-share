import { InferOutput } from "valibot";

import { GetStartedFormSchema } from "./schemas";

export type GetStartedForm = InferOutput<typeof GetStartedFormSchema>;
