import {
	array,
	nullable,
	object,
	record,
	string,
	enum as venum,
} from "valibot";

import { role } from "@/features/auth/consts";
import { SlimSongSetSchema } from "@/features/sections/song-set/schemas";
import { SlimSongSchema } from "@/features/sections/song/schemas";

export const PublicUserDocSchema = object({
	username: string(),
	picture: nullable(string()),
	activeSongId: nullable(string()),
	activeSongSetId: nullable(string()),
});

export const UserDocSchema = object({
	email: string(),
	roles: array(venum(role)),
	songs: record(string(), SlimSongSchema),
	songSets: record(string(), SlimSongSetSchema),
	songId: nullable(string()),
	songSetId: nullable(string()),
});
