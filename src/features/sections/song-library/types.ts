import { InferOutput } from "valibot";

import { SongLibrarySort } from "./consts";
import { SongLibraryGridFormSchema, SongLibrarySchema } from "./schemas";

export type SongLibrary = InferOutput<typeof SongLibrarySchema>;

export type SongLibraryGridForm = InferOutput<
	typeof SongLibraryGridFormSchema
> & {
	sort: SongLibrarySort;
};

export type SongLibrarySort =
	(typeof SongLibrarySort)[keyof typeof SongLibrarySort];
