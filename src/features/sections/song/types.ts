import { InferOutput } from "valibot";

import { SlimSongSchema, SongLibrarySchema, SongSchema } from "./schemas";

export type Song = InferOutput<typeof SongSchema>;

export type SlimSong = InferOutput<typeof SlimSongSchema>;

export type SongLibrary = InferOutput<typeof SongLibrarySchema>;
