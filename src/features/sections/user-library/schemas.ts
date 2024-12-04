import { object, record, string, union } from "valibot";

import { UserLibrarySort } from "./consts";
import { UserPublicDocSchema } from "@/features/firebase/schemas";
import { getValues } from "@/features/global/getKeys";

export const UserLibrarySchema = record(string(), UserPublicDocSchema);

export const UserLibraryGridFormSchema = object({
	sort: union(getValues(UserLibrarySort).map((value) => string(value))),
	search: string(),
});
