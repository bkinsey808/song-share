import { object, string, union } from "valibot";

import { SongLibrarySort } from "./consts";

export const SongLibraryGridFormSchema = object({
	sort: union(Object.values(SongLibrarySort).map((value) => string(value))),
	search: string(),
});
