import { getRomanNumerals } from "./getRomanNumerals";

describe("getRomanNumerals", () => {
	it("should return the correct roman numerals for major scale", () => {
		const scale = "2-3-4-5-6-7".split("-");
		const expected = ["I", "ii", "iii", "IV", "V", "vi", "vii"];
		const result = getRomanNumerals(scale);
		expect(result).toEqual(expected);
	});

	it("should return the correct roman numerals for minor scale", () => {
		const scale = "2-b3-4-5-6-b7".split("-");
		const expected = ["i", "ii", "bIII", "IV", "v", "vi", "bVII"];
		const result = getRomanNumerals(scale);
		expect(result).toEqual(expected);
	});
});
