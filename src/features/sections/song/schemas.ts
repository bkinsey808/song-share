import { minLength, nonEmpty, object, pipe, string } from "valibot";

export const SlimSongSchema = object({
	songName: string(),
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
	credits: string(),
	sharer: string(),
});
