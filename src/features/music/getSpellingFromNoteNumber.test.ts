import { getSpellingFromNoteNumber } from "./getSpellingFromNoteNumber";

describe("getSpellingFromNoteNumber", () => {
	it("should return the correct spelling for note number 0", () => {
		const noteNumber = 0;
		const expectedSpelling = "1";
		const result = getSpellingFromNoteNumber(noteNumber);
		expect(result).toBe(expectedSpelling);
	});

	it("should return the correct spelling for note number 1", () => {
		const noteNumber = 1;
		const expectedSpelling = "b2";
		const result = getSpellingFromNoteNumber(noteNumber);
		expect(result).toBe(expectedSpelling);
	});
});
