import { InferOutput } from "valibot";

import { SongFormSchema, SongSchema } from "./schemas";

export type Song = InferOutput<typeof SongSchema>;

export type SongForm = InferOutput<typeof SongFormSchema>;
