import { array, nullable, object, string, enum as venum } from "valibot";

import { role } from "@/features/auth/consts";

export const UserPublicDocSchema = object({
	username: string(),
	picture: nullable(string()),
	songActiveId: nullable(string()),
	songSetActiveId: nullable(string()),
});

export const UserDocSchema = object({
	email: string(),
	roles: array(venum(role)),
	songIds: array(string()),
	songSetIds: array(string()),
	songId: nullable(string()),
	songSetId: nullable(string()),
});
