import { InferOutput } from "valibot";

import { PlaylistLibrarySchema } from "./schemas";

export type PlaylistLibrary = InferOutput<typeof PlaylistLibrarySchema>;
