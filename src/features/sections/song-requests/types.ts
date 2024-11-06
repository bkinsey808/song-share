import { InferOutput } from "valibot";

import { SongRequestsSort } from "./consts";
import { SongRequestsGridFormSchema, SongRequestsSchema } from "./schemas";

export type SongRequests = InferOutput<typeof SongRequestsSchema>;

export type SongRequestsGridForm = InferOutput<
	typeof SongRequestsGridFormSchema
> & {
	sort: SongRequestsSort;
};

export type SongRequestsSort =
	(typeof SongRequestsSort)[keyof typeof SongRequestsSort];
