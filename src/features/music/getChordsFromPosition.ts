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
}):
	| {
			rawNoteNumbers: number[];
			chordSpelling: string[];
			noteNumber: number;
			scaleDegreeNumber?: number;
			scaleDegree?: string;
			spelling: string;
			name?: string;
			preferred?: boolean;
	  }[]
	| undefined => {
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
				preferred: !!sci?.booPrefer,
			};
		})
		.filter(
			(
				chord,
			): chord is {
				rawNoteNumbers: number[];
				chordSpelling: (
					| "b2"
					| "2"
					| "b3"
					| "3"
					| "4"
					| "b5"
					| "5"
					| "b6"
					| "6"
					| "b7"
					| "7"
				)[];
				noteNumber: number;
				scaleDegreeNumber: number;
				scaleDegree:
					| "b2"
					| "2"
					| "b3"
					| "3"
					| "4"
					| "b5"
					| "5"
					| "b6"
					| "6"
					| "b7"
					| "7";
				spelling: string;
				name: string;
				preferred: boolean;
			} => chord.noteNumber !== "x",
		);
};
