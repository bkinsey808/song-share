import { range } from "./range";

describe("range", () => {
	it("should return an array of numbers from 0 to 10", () => {
		expect(range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
	});

	it("should return an array of numbers from 5 to 10", () => {
		expect(range(5, 10)).toEqual([5, 6, 7, 8, 9]);
	});

	it("should return an array of numbers from 5 to 10 with a step of 2", () => {
		expect(range(5, 10, 2)).toEqual([5, 7, 9]);
	});

	it("should return an array of numbers from 10 to 0", () => {
		expect(range(10, 0, -1)).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
	});

	it("should return an array of numbers from 10 to 0 with a step of 2", () => {
		expect(range(10, 0, -2)).toEqual([10, 8, 6, 4, 2]);
	});

	it("should return an empty array", () => {
		expect(range(0, 10, -1)).toEqual([]);
	});
});
