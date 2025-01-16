import { InferOutput } from "valibot";

import { SongFormSchema } from "./schemas";

export type SongForm = InferOutput<typeof SongFormSchema>;
