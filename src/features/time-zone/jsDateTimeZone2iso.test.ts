import { jsDateTimeZone2iso } from "./jsDateTimeZone2iso";

describe("jsDateTimeZone2iso", () => {
	it("should return undefined if date is undefined", () => {
		const result = jsDateTimeZone2iso(undefined, "America/New_York");
		expect(result).toBeUndefined();
	});

	it("should return undefined if timeZone is undefined", () => {
		const result = jsDateTimeZone2iso(new Date(), undefined);
		expect(result).toBeUndefined();
	});

	it("should return undefined if timeZone is null", () => {
		const result = jsDateTimeZone2iso(new Date(), null);
		expect(result).toBeUndefined();
	});

	it("should return ISO string if date and timeZone are valid", () => {
		const date = new Date("2023-10-01T12:00:00Z");
		const timeZone = "America/New_York";
		const result = jsDateTimeZone2iso(date, timeZone);
		expect(result).toBe("2023-10-01T08:00:00.000-04:00");
	});
});
