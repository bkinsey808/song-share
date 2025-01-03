import { chordNumbersMatchPositionNumbers } from "./chordNumbersMatchPositionNumber";
import { filterByMaxMuted } from "./filterByMaxMuted";
import { getPositionNumbers } from "./getPositionNumbers";
import { getPositionValuesForFret } from "./getPositionValuesForFret";
import { Tuning } from "./types";
import { generateSequences } from "@/features/math/generateSequences";

export const getPositionsAtFret = ({
	fret,
	tuning,
	chordNumbers,
	maxFret,
	maxFretSpan,
	maxMuted,
}: {
	fret: number;
	tuning: Tuning;
	chordNumbers: number[];
	maxFret: number;
	maxFretSpan: number;
	maxMuted: number;
}): (number | "x")[][] => {
	const values = getPositionValuesForFret({
		fret,
		maxFret,
		maxFretSpan,
	});
	const sequences = generateSequences(values, tuning.length);
	const positionArrays = sequences
		.filter(filterByMaxMuted(maxMuted))
		.filter((positionArray) =>
			positionArray.some(
				(positionArrayElement) => positionArrayElement === fret,
			),
		)
		.filter((positionArray) => {
			const positionNumbers = getPositionNumbers(positionArray, tuning);
			return chordNumbersMatchPositionNumbers(chordNumbers, positionNumbers);
		});

	return positionArrays;
};
