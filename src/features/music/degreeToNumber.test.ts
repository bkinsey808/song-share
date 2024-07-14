import { degreeToNumber } from "./degreeToNumber";

describe("scaleDegreeToNumber", () => {
	it("returns the scale degree if the note is in the scale", () => {
		expect(degreeToNumber("1")).toBe(0);
		expect(degreeToNumber("2")).toBe(2);
		expect(degreeToNumber("3")).toBe(4);
		expect(degreeToNumber("4")).toBe(5);
		expect(degreeToNumber("5")).toBe(7);
		expect(degreeToNumber("6")).toBe(9);
		expect(degreeToNumber("7")).toBe(11);

		expect(degreeToNumber("b1")).toBe(11);
		expect(degreeToNumber("b2")).toBe(1);
		expect(degreeToNumber("b3")).toBe(3);
		expect(degreeToNumber("b4")).toBe(4);
		expect(degreeToNumber("b5")).toBe(6);
		expect(degreeToNumber("b6")).toBe(8);
		expect(degreeToNumber("b7")).toBe(10);

		expect(degreeToNumber("bb1")).toBe(10);
		expect(degreeToNumber("bb2")).toBe(0);
		expect(degreeToNumber("bb3")).toBe(2);
		expect(degreeToNumber("bb4")).toBe(3);
		expect(degreeToNumber("bb5")).toBe(5);
		expect(degreeToNumber("bb6")).toBe(7);
		expect(degreeToNumber("bb7")).toBe(9);

		expect(degreeToNumber("#1")).toBe(1);
		expect(degreeToNumber("#2")).toBe(3);
		expect(degreeToNumber("#3")).toBe(5);
		expect(degreeToNumber("#4")).toBe(6);
		expect(degreeToNumber("#5")).toBe(8);
		expect(degreeToNumber("#6")).toBe(10);
		expect(degreeToNumber("#7")).toBe(0);

		expect(degreeToNumber("##1")).toBe(2);
		expect(degreeToNumber("##2")).toBe(4);
		expect(degreeToNumber("##3")).toBe(6);
		expect(degreeToNumber("##4")).toBe(7);
		expect(degreeToNumber("##5")).toBe(9);
		expect(degreeToNumber("##6")).toBe(11);
		expect(degreeToNumber("##7")).toBe(1);
	});
});
