import { InferOutput } from "valibot";

import { SlimSongSetSchema, SongSetSchema } from "./schemas";

export type SongSet = InferOutput<typeof SongSetSchema>;

export type SlimSongSet = InferOutput<typeof SlimSongSetSchema>;
