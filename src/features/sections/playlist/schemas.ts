import { array, minLength, nonEmpty, object, pipe, string } from "valibot";

export const SlimPlaylistSchema = object({
	playlistName: string(),
	sharer: string(),
});

export const PlaylistSchema = object({
	playlistName: pipe(
		string(),
		nonEmpty("Playlist Name is required"),
		minLength(3, "Playlist Name must be at least 3 characters"),
	),
	sharer: string(),
	songs: array(
		object({
			songId: string(),
		}),
	),
});

export const PlaylistFormSchema = object({
	playlistName: pipe(
		string(),
		nonEmpty("Playlist Name is required"),
		minLength(3, "Playlist Name must be at least 3 characters"),
	),
	sharer: string(),
});

export const PlaylistGridFormSchema = object({
	playlistId: string(),
	songs: array(
		object({
			songId: string(),
		}),
	),
});
