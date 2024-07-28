import { minLength, nonEmpty, object, pipe, record, string } from "valibot";

export const SongSchema = object({
	songName: pipe(
		string(),
		nonEmpty("Song Name is required"),
		minLength(3, "Song Name must be at least 3 characters"),
	),
	translation: string(),
});

export const SlimSongSchema = object({
	songName: string(),
	sharer: string(),
});

export const SongLibrarySongSchema = object({
	songName: string(),
	sharer: string(),
	translation: string(),
});

export const SongLibrarySchema = record(string(), SongLibrarySongSchema);
