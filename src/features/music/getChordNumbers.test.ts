import { getChordNumbers } from "./getChordNumbers";

describe("getChordNumbers", () => {
	it("should return the correct chord numbers", () => {
		const chord = ["3", "5"];
		expect(
			getChordNumbers({
				chordScaleDegree: "1",
				chord,
				keyNote: "C",
			}),
		).toEqual([0, 4, 7]);
		expect(
			getChordNumbers({
				chordScaleDegree: "b2",
				chord,
				keyNote: "C",
			}),
		).toEqual([1, 5, 8]);

		expect(
			getChordNumbers({
				chordScaleDegree: "2",
				chord,
				keyNote: "C",
			}),
		).toEqual([2, 6, 9]);
		expect(
			getChordNumbers({
				chordScaleDegree: "1",
				chord,
				keyNote: "Db",
			}),
		).toEqual([1, 5, 8]);
		expect(
			getChordNumbers({
				chordScaleDegree: "b2",
				chord,
				keyNote: "Db",
			}),
		).toEqual([2, 6, 9]);
	});

	it("should return the correct chord numbers for different chord types", () => {
		expect(
			getChordNumbers({
				chordScaleDegree: "1",
				chord: ["3", "5", "7"],
				keyNote: "C",
			}),
		).toEqual([0, 4, 7, 11]);
		expect(
			getChordNumbers({
				chordScaleDegree: "4",
				chord: ["3", "5", "7"],
				keyNote: "C",
			}),
		).toEqual([5, 9, 0, 4]);

		expect(
			getChordNumbers({
				chordScaleDegree: "5",
				chord: ["3", "5", "7"],
				keyNote: "C",
			}),
		).toEqual([7, 11, 2, 6]);
	});
});
