import { object, string } from "valibot";

export const LogSchema = object({
	songId: string(),
	notes: string(),
	/** the utf iso date */
	date: string(),
});

export const LogFormSchema = object({
	logId: string(),
	songId: string(),
	notes: string(),
	date: string(),
});
