import { InferOutput } from "valibot";

import { songLibrarySort } from "./consts";
import { SongLibrarySchema } from "./schemas";

export type SongLibrary = InferOutput<typeof SongLibrarySchema>;

export type SongLibrarySort =
	(typeof songLibrarySort)[keyof typeof songLibrarySort];
