import { Schema as S } from "@effect/schema";

import { Role } from "../auth/enums";
import { SlimSongSchema } from "../music/schemas";

export const UserDocSchema = S.Struct({
	username: S.String,
	picture: S.Union(S.String, S.Null),
	roles: S.Array(S.Literal(...Object.values(Role))),
	songs: S.Record(S.String, SlimSongSchema),
});
