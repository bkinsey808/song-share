import { getInKeyScale } from "./getInKeyScale";

describe("getInKeyScale", () => {
	it("should return true for a chord in the key scale", () => {
		const result = getInKeyScale({
			chordScaleDegree: "1",
			chord: ["3", "5"],
			keyNote: "C",
			scale: ["2", "3", "5"],
		});
		expect(result).toBe(true);
	});
});
