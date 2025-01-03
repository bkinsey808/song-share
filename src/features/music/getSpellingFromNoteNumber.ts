import { degrees } from "./degrees";

export const getSpellingFromNoteNumber = (noteNumber: number): string => {
	// eslint-disable-next-line no-param-reassign
	noteNumber = noteNumber % 12;
	return degrees[noteNumber];
};
