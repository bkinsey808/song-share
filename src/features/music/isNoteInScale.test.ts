import { isNoteInScale } from "./isNoteInScale";

describe("isNoteInScale", () => {
	it("returns undefined if the note is not in the scale", () => {
		expect(
			isNoteInScale({
				keyNote: "C",
				scale: "2-3-4-5-6-7".split("-"),
				note: "C",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "C",
				scale: "2-3-4-5-6-7".split("-"),
				note: "C#",
			}),
		).toBe(false);
	});

	it("returns the scale degree if the note is in the scale", () => {
		expect(
			isNoteInScale({
				keyNote: "C",
				scale: "2-3-4-5-6-7".split("-"),
				note: "D",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "C",
				scale: "2-3-4-5-6-7".split("-"),
				note: "E",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "C",
				scale: "2-3-4-5-6-7".split("-"),
				note: "F",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "C",
				scale: "2-3-4-5-6-7".split("-"),
				note: "G",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "C",
				scale: "2-3-4-5-6-7".split("-"),
				note: "A",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "C",
				scale: "2-3-4-5-6-7".split("-"),
				note: "B",
			}),
		).toBe(true);

		expect(
			isNoteInScale({
				keyNote: "Db",
				scale: "2-3-4-5-6-7".split("-"),
				note: "Db",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "Db",
				scale: "2-3-4-5-6-7".split("-"),
				note: "Eb",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "Db",
				scale: "2-3-4-5-6-7".split("-"),
				note: "F",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "Db",
				scale: "2-3-4-5-6-7".split("-"),
				note: "Gb",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "Db",
				scale: "2-3-4-5-6-7".split("-"),
				note: "Ab",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "Db",
				scale: "2-3-4-5-6-7".split("-"),
				note: "Bb",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "Db",
				scale: "2-3-4-5-6-7".split("-"),
				note: "C",
			}),
		).toBe(true);

		expect(
			isNoteInScale({
				keyNote: "B#",
				scale: "1-2-3-4-5-6-7".split("-"),
				note: "C",
			}),
		).toBe(true);
		expect(
			isNoteInScale({
				keyNote: "E#",
				scale: "1-2-3-4-5-6-7".split("-"),
				note: "C",
			}),
		).toBe(true);
	});
});
