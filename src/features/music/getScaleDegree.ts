import { degrees } from "./degrees";
import { getNoteNumber } from "./getNoteNumber";

export const getScaleDegree = (keyNote?: string, note?: string) => {
	const keyNoteNumber = getNoteNumber(keyNote);
	const noteNumber = getNoteNumber(note);

	if (keyNoteNumber === undefined || noteNumber === undefined) {
		return undefined;
	}

	const scaleDegreeNumber = (noteNumber - keyNoteNumber + 12) % 12;
	return degrees[scaleDegreeNumber];
};
