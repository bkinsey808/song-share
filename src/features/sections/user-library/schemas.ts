import { record, string } from "valibot";

import { UserPublicDocSchema } from "@/features/firebase/schemas";

export const UserLibrarySchema = record(string(), UserPublicDocSchema);
