import { degreeToNumber } from "./degreeToNumber";
import { getNoteNumber } from "./getNoteNumber";
import { KeyNote, Scale } from "./types";

export const getSciNumbers = (sci: Scale, keyNote?: KeyNote): number[] => {
	const keyNoteNumber = getNoteNumber(keyNote) ?? 0;

	return [
		keyNoteNumber,
		...sci.map(
			(scaleDegree) =>
				((degreeToNumber(scaleDegree) ?? 0) + keyNoteNumber) % 12,
		),
	];
};
