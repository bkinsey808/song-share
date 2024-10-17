import { array, object, record, string } from "valibot";

export const SongLogFormSchema = object({
	logId: string(),
	songId: string(),
	notes: string(),
	date: string(),
});

export const SongLogEntrySchema = object({
	logId: string(),
	notes: string(),
	date: string(),
});

export const SongLogSchema = object({
	songId: string(),
	uid: string(),
	logs: record(
		string(),
		object({
			notes: string(),
			date: string(),
		}),
	),
	logIds: array(string()),
});
