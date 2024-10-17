import { InferOutput } from "valibot";

import {
	SongLogEntrySchema,
	SongLogFormSchema,
	SongLogSchema,
} from "./schemas";

export type SongLogForm = InferOutput<typeof SongLogFormSchema>;

export type SongLog = InferOutput<typeof SongLogSchema>;

export type SongLogEntry = InferOutput<typeof SongLogEntrySchema>;
