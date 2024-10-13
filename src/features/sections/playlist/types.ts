import { InferOutput } from "valibot";

import {
	PlaylistFormSchema,
	PlaylistGridFormSchema,
	PlaylistSchema,
	SlimPlaylistSchema,
} from "./schemas";

export type Playlist = InferOutput<typeof PlaylistSchema>;

export type PlaylistForm = InferOutput<typeof PlaylistFormSchema>;

export type PlaylistGridForm = InferOutput<typeof PlaylistGridFormSchema>;

export type SlimPlaylist = InferOutput<typeof SlimPlaylistSchema>;
