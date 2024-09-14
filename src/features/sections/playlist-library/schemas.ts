import { record, string } from "valibot";

import { PlaylistSchema } from "@/features/sections/playlist/schemas";

export const PlaylistLibrarySchema = record(string(), PlaylistSchema);
