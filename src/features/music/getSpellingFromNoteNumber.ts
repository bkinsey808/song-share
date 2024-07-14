import { degrees } from "./degrees";

export const getSpellingFromNoteNumber = (noteNumber: number) => {
	noteNumber = noteNumber % 12;
	return degrees[noteNumber];
};
