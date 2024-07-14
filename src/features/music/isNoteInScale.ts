import { getNoteNumber } from "./getNoteNumber";
import { getSciNumbers } from "./getSciNumbers";
import { Scale } from "./types";

export const isNoteInScale = ({
	keyNote,
	scale,
	note,
}: {
	keyNote?: string | undefined;
	scale: Scale;
	note?: string | undefined;
}) => {
	const sciNumbers = getSciNumbers(scale, keyNote);
	const noteNumber = (getNoteNumber(note) ?? 0) % 12;
	const scaleDegreeIndex = sciNumbers.indexOf(noteNumber);
	const keyNoteNumber = (getNoteNumber(keyNote) ?? 0) % 12;
	const scaleDegree =
		scaleDegreeIndex === undefined
			? undefined
			: keyNoteNumber === noteNumber
				? "1"
				: scale[scaleDegreeIndex - 1];

	return !!scaleDegree;
};
