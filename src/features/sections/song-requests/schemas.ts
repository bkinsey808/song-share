import { array, object, optional, record, string, union } from "valibot";

import { SongRequestsSort } from "./consts";

export const SongRequestsSchema = optional(record(string(), array(string())));

export const SongRequestsGridFormSchema = object({
	sort: union(Object.values(SongRequestsSort).map((value) => string(value))),
	search: string(),
});
