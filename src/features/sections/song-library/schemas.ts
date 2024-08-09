import { record, string } from "valibot";

import { SongSchema } from "../song/schemas";

export const SongLibrarySchema = record(string(), SongSchema);
