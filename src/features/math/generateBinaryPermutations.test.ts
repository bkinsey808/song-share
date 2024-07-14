import { generateBinaryPermutations } from "./generateBinaryPermutations";

describe("generateBinaryPermutations", () => {
	test("should generate binary permutations for n = 3", () => {
		const n = 3;
		const result = generateBinaryPermutations(n);
		const expected = ["000", "100", "010", "001", "110", "101", "011", "111"];
		expect(result).toEqual(expected);
	});

	test("should generate binary permutations for n = 4", () => {
		const n = 4;
		const result = generateBinaryPermutations(n);
		const expected = [
			"0000",
			"1000",
			"0100",
			"0010",
			"0001",
			"1100",
			"1010",
			"0110",
			"1001",
			"0101",
			"0011",
			"1110",
			"1101",
			"1011",
			"0111",
			"1111",
		];
		expect(result).toEqual(expected);
	});
});
