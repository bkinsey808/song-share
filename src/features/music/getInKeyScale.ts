import { getChordNumbers } from "./getChordNumbers";
import { getKeyScaleNumbers } from "./getKeyScaleNumbers";
import { Chord, ChordScaleDegree, KeyNote, Scale } from "./types";

export const getInKeyScale = ({
	chordScaleDegree,
	chord,
	keyNote,
	scale,
}: {
	chordScaleDegree: ChordScaleDegree;
	chord: Chord;
	keyNote?: KeyNote;
	scale: Scale;
}) => {
	const chordNumbers = getChordNumbers({ chordScaleDegree, chord, keyNote });
	const keyScaleNumbers = getKeyScaleNumbers({ keyNote, scale });

	return chordNumbers.every((chordNumber) =>
		keyScaleNumbers.includes(chordNumber),
	);
};
