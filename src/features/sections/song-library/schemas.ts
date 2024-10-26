import { object, record, string, union } from "valibot";

import { SongLibrarySort } from "./consts";
import { SongSchema } from "@/features/sections/song/schemas";

export const SongLibrarySchema = record(string(), SongSchema);

export const SongLibraryGridFormSchema = object({
	sort: union(Object.values(SongLibrarySort).map((value) => string(value))),
	search: string(),
});
