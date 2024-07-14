import { Schema as S } from "@effect/schema";

import {
	ChordScaleDegreeSchema,
	ChordSchema,
	InstrumentTuningSchema,
	KeyNoteSchema,
	PositionSchema,
	ScaleSchema,
	SlimSongSchema,
	SongLibrarySchema,
	SongSchema,
	TuningSchema,
} from "./schemas";

export type Chord = S.Schema.Type<typeof ChordSchema>;
export type SlimSong = S.Schema.Type<typeof SlimSongSchema>;
export type Song = S.Schema.Type<typeof SongSchema>;
export type SongLibrary = S.Schema.Type<typeof SongLibrarySchema>;
export type InstrumentTuning = S.Schema.Type<typeof InstrumentTuningSchema>;
export type Tuning = S.Schema.Type<typeof TuningSchema>;
export type Position = S.Schema.Type<typeof PositionSchema>;
export type ChordScaleDegree = S.Schema.Type<typeof ChordScaleDegreeSchema>;
export type Scale = S.Schema.Type<typeof ScaleSchema>;
export type KeyNote = S.Schema.Type<typeof KeyNoteSchema>;
