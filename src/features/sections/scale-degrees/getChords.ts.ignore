import { Scale } from "@/app/d/types";
import { range } from "@/features/math/range";
import { degrees } from "@/features/music/degrees";
import { getChordNumbers } from "@/features/music/getChordNumbers";
import { getSciNumbers } from "@/features/music/getSciNumbers";
import { romanNumerals } from "@/features/music/romanNumerals";
import { sciList, sciListError } from "@/features/music/sci";

export const getChords = ({
	scale,
	minNotes = 2,
	maxNotes = 4,
	scaleIndex,
	preferred = true,
	keyNote,
}: {
	scale: Scale;
	minNotes?: number;
	maxNotes?: number;
	scaleIndex?: number;
	preferred?: boolean;
	keyNote?: string;
}) => {
	if (!sciList) {
		console.log({ sciListError });
		// throw new Error("sci-list.json is invalid");
		return;
	}

	const scaleNumbers = getSciNumbers(scale);

	const [minIndex, maxIndex] =
		scaleIndex !== undefined
			? [scaleIndex, scaleIndex]
			: [0, scaleNumbers.length - 1];

	return range(minIndex, maxIndex + 1).flatMap((scaleIndex) => {
		const romanNumeral = romanNumerals[scaleIndex];
		const chordScaleDegree = degrees[scaleIndex];

		const chords = sciList
			?.filter((sci) => {
				if (sci.numNote < minNotes || sci.numNote > maxNotes) {
					return false;
				}

				if (preferred && sci.booPrefer === 0) {
					return false;
				}

				const chord = sci.txtSpelling.replaceAll(",", "-").split("-");
				const chordNumbers = getChordNumbers({
					chordScaleDegree,
					chord,
					keyNote,
				});
				const chordInScale = chordNumbers.every((chordNumber) =>
					scaleNumbers.includes(chordNumber),
				);
				return chordInScale;
			})
			.map((sci) => ({ sci, chord: sci.txtSpelling, romanNumeral }));

		return chords;
	});
};
