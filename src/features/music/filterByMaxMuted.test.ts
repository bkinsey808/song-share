import { filterByMaxMuted } from "./filterByMaxMuted";

describe("filterByMaxMuted", () => {
	it("should return true if sequence has less than or equal to max muted notes", () => {
		const maxMuted = 2;
		const sequence = ["x", "1", "2", "1", "1", "1"];
		expect(filterByMaxMuted(maxMuted)(sequence)).toBe(true);
	});

	it("should return false if sequence has more than max muted notes", () => {
		const maxMuted = 2;
		const sequence = ["x", "x", "x", "x", "x", "x", "x"];
		expect(filterByMaxMuted(maxMuted)(sequence)).toBe(false);
	});
});
