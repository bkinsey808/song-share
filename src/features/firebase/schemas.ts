import {
	array,
	boolean,
	nullable,
	object,
	optional,
	record,
	string,
	enum as venum,
} from "valibot";

import { role } from "@/features/auth/consts";
import { SongRequestsSchema } from "@/features/sections/song-requests/schemas";

export const UserPublicDocSchema = object({
	username: string(),
	picture: nullable(string()),
	songActiveId: nullable(string()),
	playlistActiveId: optional(nullable(string())),
	usersActive: optional(record(string(), string())),
	songRequests: SongRequestsSchema,
});

export const UserDocSchema = object({
	email: string(),
	roles: array(venum(role)),
	songIds: array(string()),
	playlistIds: optional(nullable(array(string()))),
	songId: nullable(string()),
	playlistId: optional(nullable(string())),
	timeZone: optional(nullable(string())),
	userIds: optional(array(string())),
	wakeLockActive: optional(boolean()),
});
