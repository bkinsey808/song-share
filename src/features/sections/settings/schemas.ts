import { boolean, object, optional, string } from "valibot";

export const SettingsSchema = object({
	useSystemTimeZone: boolean(),
	timeZone: optional(string()),
	wakeLockActive: optional(boolean()),
});
