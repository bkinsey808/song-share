import { Schema as S } from "@effect/schema";

import { degrees } from "./degrees";

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
