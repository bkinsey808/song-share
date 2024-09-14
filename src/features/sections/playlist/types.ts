import { InferOutput } from "valibot";

import { PlaylistSchema, SlimPlaylistSchema } from "./schemas";

export type Playlist = InferOutput<typeof PlaylistSchema>;

export type SlimPlaylist = InferOutput<typeof SlimPlaylistSchema>;
