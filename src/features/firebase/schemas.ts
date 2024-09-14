import { array, nullable, object, string, enum as venum } from "valibot";

import { role } from "@/features/auth/consts";

export const UserPublicDocSchema = object({
	username: string(),
	picture: nullable(string()),
	songActiveId: nullable(string()),
	playlistActiveId: nullable(string()),
});

export const UserDocSchema = object({
	email: string(),
	roles: array(venum(role)),
	songIds: array(string()),
	playlistIds: array(string()),
	songId: nullable(string()),
	playlistId: nullable(string()),
});
