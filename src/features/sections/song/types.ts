import { InferOutput } from "valibot";

import { SlimSongSchema, SongSchema } from "./schemas";

export type Song = InferOutput<typeof SongSchema>;

export type SlimSong = InferOutput<typeof SlimSongSchema>;
