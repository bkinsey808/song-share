import { getScaleDegree } from "./getScaleDegree";

describe("getScaleDegree", () => {
	it("returns the scale degree if the note is in the scale", () => {
		expect(getScaleDegree("C", "C")).toEqual("1");
		expect(getScaleDegree("C", "D")).toEqual("2");
		expect(getScaleDegree("C", "E")).toEqual("3");
		expect(getScaleDegree("C", "F")).toEqual("4");
		expect(getScaleDegree("C", "G")).toEqual("5");
		expect(getScaleDegree("C", "A")).toEqual("6");
		expect(getScaleDegree("C", "B")).toEqual("7");

		expect(getScaleDegree("C", "C#")).toEqual("b2");
		expect(getScaleDegree("C", "D#")).toEqual("b3");
		expect(getScaleDegree("C", "F#")).toEqual("b5");
		expect(getScaleDegree("C", "G#")).toEqual("b6");
		expect(getScaleDegree("C", "A#")).toEqual("b7");
		expect(getScaleDegree("C", "B#")).toEqual("1");

		expect(getScaleDegree("Db", "Db")).toEqual("1");
		expect(getScaleDegree("Db", "Eb")).toEqual("2");
		expect(getScaleDegree("Db", "F")).toEqual("3");
		expect(getScaleDegree("Db", "Gb")).toEqual("4");
		expect(getScaleDegree("Db", "Ab")).toEqual("5");
		expect(getScaleDegree("Db", "Bb")).toEqual("6");
		expect(getScaleDegree("Db", "C")).toEqual("7");
	});
});
