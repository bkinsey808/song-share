import { chordScaleDegrees } from "./chordScaleDegrees";

describe("chordScaleDegrees", () => {
	it("returns the scale degree if the note is in the scale", () => {
		expect(
			chordScaleDegrees("2-3-4-5-6-7".split("-"), "3-5".split("-")),
		).toEqual(["1", "4", "5"]);
		expect(
			chordScaleDegrees("2-3-4-5-6-7".split("-"), "b3-5".split("-")),
		).toEqual(["2", "3", "6"]);
		expect(
			chordScaleDegrees("2-3-4-5-6-7".split("-"), "b3-b5".split("-")),
		).toEqual(["7"]);
		expect(
			chordScaleDegrees("2-3-4-5-6-7".split("-"), "b3-b5-b7".split("-")),
		).toEqual(["7"]);
		expect(
			chordScaleDegrees("2-3-4-5-6-7".split("-"), "4-5".split("-")),
		).toEqual(["1", "2", "3", "5", "6"]);
		expect(
			chordScaleDegrees("2-3-4-5-6-7".split("-"), "3-b6".split("-")),
		).toEqual([]);
	});
});
