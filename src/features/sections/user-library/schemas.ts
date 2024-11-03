import { object, record, string, union } from "valibot";

import { UserLibrarySort } from "./consts";
import { UserPublicDocSchema } from "@/features/firebase/schemas";

export const UserLibrarySchema = record(string(), UserPublicDocSchema);

export const UserLibraryGridFormSchema = object({
	sort: union(Object.values(UserLibrarySort).map((value) => string(value))),
	search: string(),
});
