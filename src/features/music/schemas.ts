import { Schema as S } from "@effect/schema";

import { degrees } from "./degrees";

// export const SlimSongSchema = S.Struct({
// 	songName: S.String,
// 	sharer: S.String,
// });
// export const SongSchema = S.Struct({
// 	songName: S.String,
// 	sharer: S.String,
// 	credits: S.Union(S.String, S.Undefined),
// 	lyrics: S.Union(S.String, S.Undefined),
// 	translation: S.Union(S.String, S.Undefined),
// 	keyNote: S.Union(S.String, S.Undefined),
// 	scale: S.Union(S.Array(S.String), S.Undefined),
// });
// export const SongLibrarySchema = S.Record(S.String, SongSchema);
export const ChordSchema = S.Array(S.String);
export const InstrumentTuningSchema = S.Union(S.String, S.Undefined);
export const TuningSchema = S.Array(S.String);
export const KeyNoteSchema = S.Union(S.String, S.Undefined);
export const ScaleSchema = S.Array(S.String);
export const PositionSchema = S.Array(S.Union(S.Number, S.Literal("x")));
export const ChordScaleDegreeSchema = S.Union(
	S.Literal(...Object.values(degrees)),
	S.Undefined,
);
