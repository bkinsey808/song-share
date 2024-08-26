import { degrees } from "./degrees";
import { getNoteNumber } from "./getNoteNumber";
import { getSciBySpelling } from "./sci";
import { KeyNote, Position, Tuning } from "./types";

export const getChordsFromPosition = ({
	tuning,
	position,
	keyNote,
}: {
	tuning: Tuning;
	position: Position;
	keyNote?: KeyNote;
}) => {
	const openNumbers = tuning.map((note) => getNoteNumber(note));
	const keyNoteNumber = getNoteNumber(keyNote);
	if (keyNoteNumber === undefined) {
		return undefined;
	}

	const noteNumbers = position.map((fret, course) => {
		const openNumber = openNumbers[course];

		if (fret === "x" || openNumber === undefined) {
			return "x";
		}

		return (openNumber + fret) % 12;
	});

	return noteNumbers
		.map((noteNumber, course) => {
			const rawNoteNumbers = noteNumbers
				.slice(course)
				.concat(noteNumbers.slice(0, course))
				.filter(
					(innerNoteNumber): innerNoteNumber is number =>
						innerNoteNumber !== "x",
				);

			const initialRawNoteNumber = rawNoteNumbers[0];

			const chordSpelling = Array.from(
				new Set(
					rawNoteNumbers
						.map(
							(innerNoteNumber) =>
								(innerNoteNumber - initialRawNoteNumber + 12) % 12,
						)
						.slice(1),
				),
			)
				.filter((innerNoteNumber) => innerNoteNumber !== 0)
				.sort((a, b) => a - b)
				.map((innerNoteNumber) => degrees[innerNoteNumber])
				.filter((innerNoteNumber) => innerNoteNumber !== "1");

			const sci = getSciBySpelling(chordSpelling);

			const scaleDegreeNumber =
				noteNumber !== "x" ? (noteNumber - keyNoteNumber + 12) % 12 : undefined;
			const scaleDegree =
				scaleDegreeNumber !== undefined
					? degrees[scaleDegreeNumber]
					: undefined;

			return {
				rawNoteNumbers,
				chordSpelling,
				noteNumber,
				scaleDegreeNumber,
				scaleDegree,
				spelling: chordSpelling.join(","),
				name: sci?.txtName,
				preferred: sci?.booPrefer,
			};
		})
		.filter(({ noteNumber }) => noteNumber !== "x");
};
