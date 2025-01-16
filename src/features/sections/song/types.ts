import { InferOutput } from "valibot";

import { SongSchema } from "./schemas";

export type Song = InferOutput<typeof SongSchema>;
