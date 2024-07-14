import { getSciNumbers } from "./getSciNumbers";

describe("getSciNumbers", () => {
	it("returns the scale degree if the note is in the scale", () => {
		expect(getSciNumbers("2-3-4-5-6-7".split("-"))).toEqual([
			0, 2, 4, 5, 7, 9, 11,
		]);
		expect(getSciNumbers("2-3-4-5-6-7".split("-"), "C")).toEqual([
			0, 2, 4, 5, 7, 9, 11,
		]);
		expect(getSciNumbers("2-3-4-5-6-7".split("-"), "Db")).toEqual([
			1, 3, 5, 6, 8, 10, 0,
		]);
	});
});
