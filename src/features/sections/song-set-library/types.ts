import { InferOutput } from "valibot";

import { SongSetLibrarySchema } from "./schemas";

export type SongSetLibrary = InferOutput<typeof SongSetLibrarySchema>;
