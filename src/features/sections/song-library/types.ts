import { InferOutput } from "valibot";

import { SongLibrarySchema } from "./schemas";

export type SongLibrary = InferOutput<typeof SongLibrarySchema>;
