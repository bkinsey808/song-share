import { binaryStringToIndexes } from "./binaryStringToIndexes";

describe("binaryStringToIndexes", () => {
	test("should convert binary string to indexes", () => {
		const binaryString = "101";
		const result = binaryStringToIndexes(binaryString);
		const expected = [0, 2];
		expect(result).toEqual(expected);
	});

	test("should convert binary string to indexes", () => {
		const binaryString = "111";
		const result = binaryStringToIndexes(binaryString);
		const expected = [0, 1, 2];
		expect(result).toEqual(expected);
	});

	test("should convert binary string to indexes", () => {
		const binaryString = "000";
		const result = binaryStringToIndexes(binaryString);
		const expected: number[] = [];
		expect(result).toEqual(expected);
	});
});
