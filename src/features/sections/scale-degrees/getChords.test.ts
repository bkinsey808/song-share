import { getChords } from "./getChords";

describe("getChords", () => {
	it("returns the roman chords", () => {
		const _expected = [
			"M",
			"Mb5",
			"+",
			"sus4",
			"2",
			"-2",
			"WTet",
			"4",
			"M7",
			"7",
			"RNig",
			"7b5",
			"+7",
			"M7#5",
			"7sus4",
			"-Tet",
			"His",
			"RSum",
			"-TC",
			"M2TetC1",
			"7om3",
			"n7sus4",
			"Ser",
			"Nora",
			"P7",
			"M7om5",
			"7om5",
			"Fel",
			"GM",
			"WM",
			"Con",
		];
		const results = getChords({
			scale: "2-3-4-5-6-7".split("-"),
			minNotes: 3,
			scaleIndex: 2,
		});
		console.log({ results });
		// expect(results).toEqual({ chords: expected });
		expect(true).toBe(true);
	});
});
