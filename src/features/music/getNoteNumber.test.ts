import { getNoteNumber } from "./getNoteNumber";

describe("getNoteNumber", () => {
	it("returns undefined if note is undefined", () => {
		expect(getNoteNumber(undefined)).toBe(undefined);
	});

	it("returns undefined if note is invalid", () => {
		expect(getNoteNumber("invalid")).toBe(undefined);
	});

	it("returns 0 for C0", () => {
		expect(getNoteNumber("C0")).toBe(0);
	});

	it("returns 11 for B0", () => {
		expect(getNoteNumber("B0")).toBe(11);
	});

	it("returns 12 for C1", () => {
		expect(getNoteNumber("C1")).toBe(12);
	});

	it("returns 23 for B1", () => {
		expect(getNoteNumber("B1")).toBe(23);
	});

	it("returns 24 for C2", () => {
		expect(getNoteNumber("C2")).toBe(24);
	});

	it("returns 35 for B2", () => {
		expect(getNoteNumber("B2")).toBe(35);
	});

	it("returns 36 for C3", () => {
		expect(getNoteNumber("C3")).toBe(36);
	});

	it("returns 47 for B3", () => {
		expect(getNoteNumber("B3")).toBe(47);
	});

	it("returns 48 for C4", () => {
		expect(getNoteNumber("C4")).toBe(48);
	});

	it("returns 59 for B4", () => {
		expect(getNoteNumber("B4")).toBe(59);
	});

	it("returns 60 for C5", () => {
		expect(getNoteNumber("C5")).toBe(60);
	});

	it("returns 71 for B5", () => {
		expect(getNoteNumber("B5")).toBe(71);
	});

	it("returns 72 for C6", () => {
		expect(getNoteNumber("C6")).toBe(72);
	});

	it("returns 83 for B6", () => {
		expect(getNoteNumber("B6")).toBe(83);
	});

	it("returns 84 for C7", () => {
		expect(getNoteNumber("C7")).toBe(84);
	});

	it("returns 95 for B7", () => {
		expect(getNoteNumber("B7")).toBe(95);
	});
});
