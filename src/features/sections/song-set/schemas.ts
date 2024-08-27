import { array, minLength, nonEmpty, object, pipe, string } from "valibot";

export const SlimSongSetSchema = object({
	songSetName: string(),
	sharer: string(),
});

export const SongSetSchema = object({
	songSetName: pipe(
		string(),
		nonEmpty("Song Set Name is required"),
		minLength(3, "Song Set Name must be at least 3 characters"),
	),
	sharer: string(),
	songIds: array(string()),
});
