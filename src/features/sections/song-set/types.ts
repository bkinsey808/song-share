import { InferOutput } from "valibot";

import {
	SlimSongSetSchema,
	SongSetLibrarySchema,
	SongSetLibrarySongSetSchema,
	SongSetSchema,
} from "./schemas";

export type SongSet = InferOutput<typeof SongSetSchema>;

export type SlimSongSet = InferOutput<typeof SlimSongSetSchema>;

export type SongSetLibrary = InferOutput<typeof SongSetLibrarySchema>;

export type SongSetLibrarySongSet = InferOutput<
	typeof SongSetLibrarySongSetSchema
>;
