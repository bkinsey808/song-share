import {
	array,
	nullable,
	object,
	optional,
	string,
	enum as venum,
} from "valibot";

import { role } from "@/features/auth/consts";

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
	timeZone: optional(string()),
});
