import { InferOutput } from "valibot";

import { UserLibrarySort } from "./consts";
import { UserLibraryGridFormSchema, UserLibrarySchema } from "./schemas";
import { UserPublicDoc } from "@/features/firebase/types";

export type UserLibrary = InferOutput<typeof UserLibrarySchema>;

export type UserLibraryGridForm = InferOutput<
	typeof UserLibraryGridFormSchema
> & {
	sort: UserLibrarySort;
};

export type UsersActive = UserPublicDoc["usersActive"];

export type UserLibrarySort =
	(typeof UserLibrarySort)[keyof typeof UserLibrarySort];
