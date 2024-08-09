import { record, string } from "valibot";

import { SongSetSchema } from "../song-set/schemas";

export const SongSetLibrarySchema = record(string(), SongSetSchema);
