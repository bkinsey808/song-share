import { degreeToNumber } from "./degreeToNumber";
import { getNoteNumber } from "./getNoteNumber";
import { KeyNote, Scale } from "./types";

export const getKeyScaleNumbers = ({
	keyNote,
	scale,
}: {
	keyNote?: KeyNote;
	scale: Scale;
}) => {
	const keyNoteNumber = getNoteNumber(keyNote) ?? 0;

	const scaleNumbers = [
		keyNoteNumber,
		...scale.map((scaleDegree) => {
			const scaleDegreeNumber = degreeToNumber(scaleDegree) ?? 0;
			return (keyNoteNumber + scaleDegreeNumber) % 12;
		}),
	];

	return scaleNumbers;
};
