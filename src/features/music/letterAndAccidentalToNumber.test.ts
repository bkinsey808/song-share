import { letterAndAccidentalToNumber } from "./letterAndAccidentalToNumber";

describe("letterAndAccidentalToNumber", () => {
	it("converts letter and accidental to number", () => {
		expect(letterAndAccidentalToNumber("C")).toBe(0);
		expect(letterAndAccidentalToNumber("C#")).toBe(1);
		expect(letterAndAccidentalToNumber("C##")).toBe(2);
		expect(letterAndAccidentalToNumber("Cb")).toBe(-1);
		expect(letterAndAccidentalToNumber("Cbb")).toBe(-2);
		expect(letterAndAccidentalToNumber("D")).toBe(2);
		expect(letterAndAccidentalToNumber("D#")).toBe(3);
		expect(letterAndAccidentalToNumber("Db")).toBe(1);
		expect(letterAndAccidentalToNumber("Dbb")).toBe(0);
		expect(letterAndAccidentalToNumber("E")).toBe(4);
		expect(letterAndAccidentalToNumber("E#")).toBe(5);
		expect(letterAndAccidentalToNumber("Eb")).toBe(3);
		expect(letterAndAccidentalToNumber("Ebb")).toBe(2);
		expect(letterAndAccidentalToNumber("F")).toBe(5);
		expect(letterAndAccidentalToNumber("F#")).toBe(6);
		expect(letterAndAccidentalToNumber("Fb")).toBe(4);
		expect(letterAndAccidentalToNumber("Fbb")).toBe(3);
		expect(letterAndAccidentalToNumber("G")).toBe(7);
		expect(letterAndAccidentalToNumber("G#")).toBe(8);
		expect(letterAndAccidentalToNumber("Gb")).toBe(6);
		expect(letterAndAccidentalToNumber("Gbb")).toBe(5);
		expect(letterAndAccidentalToNumber("A")).toBe(9);
		expect(letterAndAccidentalToNumber("A#")).toBe(10);
		expect(letterAndAccidentalToNumber("Ab")).toBe(8);
		expect(letterAndAccidentalToNumber("Abb")).toBe(7);
		expect(letterAndAccidentalToNumber("B")).toBe(11);
		expect(letterAndAccidentalToNumber("B#")).toBe(0);
		expect(letterAndAccidentalToNumber("Bb")).toBe(10);
		expect(letterAndAccidentalToNumber("Bbb")).toBe(9);
	});
});
