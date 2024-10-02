import { object, string } from "valibot";

import { FirestoreTimestampSchema } from "@/features/firebase/timestampValidator";

export const LogSchema = object({
	songId: string(),
	notes: string(),
	date: FirestoreTimestampSchema,
});
