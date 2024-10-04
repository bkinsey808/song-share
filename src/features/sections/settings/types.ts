import { InferOutput } from "valibot";

import { SettingsSchema } from "./schemas";

export type Settings = InferOutput<typeof SettingsSchema>;
