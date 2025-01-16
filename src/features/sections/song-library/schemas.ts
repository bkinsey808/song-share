import { record, string } from "valibot";

import { SongSchema } from "@/features/sections/song/schemas";

export const SongLibrarySchema = record(string(), SongSchema);
