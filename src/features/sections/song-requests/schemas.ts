import { array, object, optional, record, string, union } from "valibot";

import { songRequestsSort } from "./consts";

export const SongRequestsSchema = optional(record(string(), array(string())));

export const SongRequestsGridFormSchema = object({
	sort: union(Object.values(songRequestsSort).map((value) => string(value))),
	search: string(),
});
