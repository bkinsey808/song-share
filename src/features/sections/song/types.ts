import { InferOutput } from "valibot";

import {
	SlimSongSchema,
	SongLibrarySchema,
	SongLibrarySongSchema,
	SongSchema,
} from "./schemas";

export type SongDetails = InferOutput<typeof SongSchema>;

export type SlimSong = InferOutput<typeof SlimSongSchema>;

export type SongLibrary = InferOutput<typeof SongLibrarySchema>;

export type SongLibrarySong = InferOutput<typeof SongLibrarySongSchema>;
