import {
	array,
	object,
	optional,
	record,
	string,
	enum as venum,
} from "valibot";

import { Role } from "../auth/enums";
import {
	SlimSongSetSchema,
	SongSetLibrarySongSetSchema,
} from "../sections/song-set/schemas";
import { SlimSongSchema } from "@/features/sections/song/schemas";

export const UserDocSchema = object({
	username: string(),
	picture: optional(string()),
	roles: array(venum(Role)),
	songs: record(string(), SlimSongSchema),
	songSets: record(string(), SlimSongSetSchema),
});

export const SongsSetSchema = record(string(), SongSetLibrarySongSetSchema);
