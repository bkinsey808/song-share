import { InferOutput } from "valibot";

import { SongLibrarySort } from "./consts";
import { SongLibraryGridFormSchema } from "./schemas";

export type SongLibraryGridForm = InferOutput<
	typeof SongLibraryGridFormSchema
> & {
	sort: SongLibrarySort;
};

export type SongLibrarySort =
	(typeof SongLibrarySort)[keyof typeof SongLibrarySort];
