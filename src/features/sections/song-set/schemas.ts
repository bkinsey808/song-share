import {
	array,
	minLength,
	nonEmpty,
	object,
	pipe,
	record,
	string,
} from "valibot";

export const SlimSongSetSchema = object({
	songSetName: string(),
	sharer: string(),
});

export const SongSetSongSchema = object({
	songKey: string(),
});

export const SongSetSchema = object({
	songSetName: pipe(
		string(),
		nonEmpty("Song Set Name is required"),
		minLength(3, "Song Set Name must be at least 3 characters"),
	),
	sharer: string(),
	songSetSongList: array(string()),
	songSetSongs: record(string(), SongSetSongSchema),
});

export const SongSetLibrarySongSetSchema = object({
	songSetName: string(),
	sharer: string(),
});

export const SongSetLibrarySchema = record(
	string(),
	SongSetLibrarySongSetSchema,
);
