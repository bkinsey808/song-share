import { object, record, string } from "valibot";

export const UserSchema = object({
	username: string(),
	picture: string(),
});

export const UserLibrarySchema = record(string(), UserSchema);
