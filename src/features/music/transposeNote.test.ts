import { transposeNote } from "./transposeNote";

describe("transposeNote", () => {
	it("returns the note transposed by the given number of semitones", () => {
		expect(transposeNote("C", 0)).toBe("C0");
		expect(transposeNote("C", 1)).toBe("Db0");
		expect(transposeNote("C", 2)).toBe("D0");
		expect(transposeNote("C", 3)).toBe("Eb0");
		expect(transposeNote("C", 4)).toBe("E0");

		expect(transposeNote("C0", 0)).toBe("C0");
		expect(transposeNote("C0", 1)).toBe("Db0");
		expect(transposeNote("C0", 2)).toBe("D0");
		expect(transposeNote("C0", 3)).toBe("Eb0");
		expect(transposeNote("C0", 4)).toBe("E0");

		expect(transposeNote("B0", 1)).toBe("C1");
		expect(transposeNote("C0", 12)).toBe("C1");
	});
});
