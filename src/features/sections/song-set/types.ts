import { InferOutput } from "valibot";

import {
	SlimSongSetSchema,
	SongSetLibrarySchema,
	SongSetSchema,
} from "./schemas";

export type SongSet = InferOutput<typeof SongSetSchema>;

export type SlimSongSet = InferOutput<typeof SlimSongSetSchema>;

export type SongSetLibrary = InferOutput<typeof SongSetLibrarySchema>;
