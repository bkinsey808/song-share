import { record, string } from "valibot";

import { SongSetSchema } from "@/features/sections/song-set/schemas";

export const SongSetLibrarySchema = record(string(), SongSetSchema);
