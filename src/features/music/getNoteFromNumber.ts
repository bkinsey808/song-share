import { notesAndFlatNotes, notesAndSharpNotes } from "./notes";

export const getNoteFromNumber = ({
	noteNumber,
	preferFlats = true,
	includeOctave = true,
}: {
	noteNumber: number | "x";
	preferFlats?: boolean;
	includeOctave?: boolean;
}) => {
	if (noteNumber === "x") {
		return "x";
	}
	const octave = Math.floor(noteNumber / 12);
	const letterAndAccidentalNumber = noteNumber % 12;

	const letterAndAccidental = preferFlats
		? notesAndFlatNotes[letterAndAccidentalNumber]
		: notesAndSharpNotes[letterAndAccidentalNumber];

	return letterAndAccidental + (includeOctave ? octave : "");
};
