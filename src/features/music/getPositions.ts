import { getChordNumbers } from "./getChordNumbers";
import { getPositionsAtFret } from "./getPositionsAtFret";
import { Chord, ChordScaleDegree, Tuning } from "./types";
import { range } from "@/features/math/range";

/** given tuning in the form of 'G4-C4-E4-E4' and keyNote in form of 'Eb' and chord in the form of i-b3-5, return an array of position arrays in the form [[2, 0, 0, 0], ...] in the order of chords sorted by smallest fret first */
export const getPositions = ({
	tuning,
	keyNote,
	chordScaleDegree,
	chord,
	maxMuted = 0,
	maxFrets = 17,
	maxFretSpan = 4,
}: {
	tuning: Tuning;
	keyNote?: string | undefined;
	chordScaleDegree: ChordScaleDegree;
	chord: Chord;
	maxMuted?: number;
	maxFrets?: number;
	maxFretSpan?: number;
}): (number | "x")[][] | undefined => {
	if (!chord || !keyNote || !tuning) {
		return undefined;
	}

	const chordNumbers = getChordNumbers({ chordScaleDegree, chord, keyNote });

	return range(0, maxFrets).flatMap((fret) => {
		const positionsAtFret = getPositionsAtFret({
			fret,
			tuning,
			chordNumbers,
			maxFret: maxFrets,
			maxFretSpan,
			maxMuted,
		});
		return positionsAtFret;
	});
};
