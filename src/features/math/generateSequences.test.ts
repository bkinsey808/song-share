import { generateSequences } from "./generateSequences";

describe("generateSequences", () => {
	it("should generate all possible multisets of length n", () => {
		expect(generateSequences([1, 2], 1)).toEqual([[1], [2]]);
		expect(generateSequences([1, 2], 2)).toEqual([
			[1, 1],
			[1, 2],
			[2, 1],
			[2, 2],
		]);
		expect(generateSequences([1, 2, 3], 2)).toEqual([
			[1, 1],
			[1, 2],
			[1, 3],
			[2, 1],
			[2, 2],
			[2, 3],
			[3, 1],
			[3, 2],
			[3, 3],
		]);
		expect(generateSequences(["x", 2], 2)).toEqual([
			["x", "x"],
			["x", 2],
			[2, "x"],
			[2, 2],
		]);
	});
});
