import { InferOutput } from "valibot";

import { songRequestsSort } from "./consts";
import { SongRequestsGridFormSchema, SongRequestsSchema } from "./schemas";

export type SongRequests = InferOutput<typeof SongRequestsSchema>;

export type SongRequestsGridForm = InferOutput<
	typeof SongRequestsGridFormSchema
> & {
	sort: SongRequestsSort;
};

export type SongRequestsSort =
	(typeof songRequestsSort)[keyof typeof songRequestsSort];
