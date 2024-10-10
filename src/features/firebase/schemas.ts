import {
	array,
	nullable,
	object,
	optional,
	record,
	string,
	enum as venum,
} from "valibot";

import { role } from "@/features/auth/consts";
import { LogSchema } from "@/features/sections/log/schemas";

export const UserPublicDocSchema = object({
	username: string(),
	picture: nullable(string()),
	songActiveId: nullable(string()),
	playlistActiveId: optional(nullable(string())),
});

export const UserDocSchema = object({
	email: string(),
	roles: array(venum(role)),
	songIds: array(string()),
	playlistIds: optional(nullable(array(string()))),
	songId: nullable(string()),
	playlistId: optional(nullable(string())),
	timeZone: optional(nullable(string())),
	logs: optional(record(string(), LogSchema)),
	logIds: optional(array(object({ logId: string() }))),
});
