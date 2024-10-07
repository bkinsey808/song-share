import { object, string } from "valibot";

export const LogSchema = object({
	songId: string(),
	notes: string(),
	date: string(),
});

export const LogFormSchema = object({
	logId: string(),
	songId: string(),
	notes: string(),
	date: string(),
});
