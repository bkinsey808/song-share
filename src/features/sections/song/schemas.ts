import { minLength, nonEmpty, object, pipe, record, string } from "valibot";

export const SlimSongSchema = object({
	songSetName: string(),
	sharer: string(),
});

export const SongSchema = object({
	songName: pipe(
		string(),
		nonEmpty("Song Name is required"),
		minLength(3, "Song Name must be at least 3 characters"),
	),
	lyrics: string(),
	translation: string(),
});

export const SongLibrarySongSchema = object({
	songName: string(),
	sharer: string(),
	lyrics: string(),
	translation: string(),
});

export const SongLibrarySchema = record(string(), SongLibrarySongSchema);
