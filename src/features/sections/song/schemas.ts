import {
	array,
	literal,
	minLength,
	nonEmpty,
	number,
	object,
	optional,
	pipe,
	string,
	union,
} from "valibot";

import { keys, scaleDegrees } from "./consts";
import { getKeys, getValues } from "@/features/global/getKeys";

const keyValueSchema = union(getValues(keys).map((key) => literal(key)));
const keyKeySchema = union(getKeys(keys).map((key) => literal(key)));
const scaleDegreeValueSchema = union(
	getValues(scaleDegrees).map((key) => literal(key)),
);

export const SongSchema = object({
	songName: pipe(
		string(),
		nonEmpty("Song Name is required"),
		minLength(3, "Song Name must be at least 3 characters"),
	),
	sharer: string(),
	lyrics: optional(string()),
	translation: optional(string()),
	credits: optional(string()),
	playlistIds: optional(array(string())),
	songKey: optional(keyValueSchema),
	songScale: optional(array(scaleDegreeValueSchema)),
});

export const SongFormSchema = object({
	songName: pipe(
		string(),
		nonEmpty("Song Name is required"),
		minLength(3, "Song Name must be at least 3 characters"),
	),
	sharer: string(),
	lyrics: optional(string()),
	translation: optional(string()),
	credits: optional(string()),
	playlistIds: optional(array(string())),
	songKey: optional(keyValueSchema),
	songKeyString: optional(keyKeySchema),
});
