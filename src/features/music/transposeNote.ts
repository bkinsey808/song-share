import { getNoteFromNumber } from "./getNoteFromNumber";
import { getNoteNumber } from "./getNoteNumber";

/** notes can take the form of C#4 or Db4, etc */
export const transposeNote = (note: string, interval: number) => {
	const noteNumber = getNoteNumber(note);

	if (noteNumber === undefined) {
		return undefined;
	}

	const newNoteNumber = noteNumber + interval;
	return getNoteFromNumber({
		noteNumber: newNoteNumber,
		preferFlats: !note.includes("#"),
	});
};
