import { isoTimeZone2iso } from "./isoTimeZone2iso";

describe("isoTimeZone2iso", () => {
	it("should return undefined if isoString is undefined", () => {
		expect(isoTimeZone2iso(undefined, "America/New_York")).toBeUndefined();
	});

	it("should convert ISO string to target timezone", () => {
		const isoString = "2023-10-01T12:00:00Z";
		const targetTimeZone = "America/New_York";
		const result = isoTimeZone2iso(isoString, targetTimeZone);
		expect(result).toBe("2023-10-01T08:00:00.000-04:00");
	});

	it("should handle different timezones correctly", () => {
		const isoString = "2023-10-01T12:00:00Z";
		const targetTimeZone = "Europe/London";
		const result = isoTimeZone2iso(isoString, targetTimeZone);
		expect(result).toBe("2023-10-01T13:00:00.000+01:00");
	});

	it("should return the same ISO string if the timezone is the same", () => {
		const isoString = "2023-10-01T12:00:00Z";
		const targetTimeZone = "UTC";
		const result = isoTimeZone2iso(isoString, targetTimeZone);
		expect(result).toBe("2023-10-01T12:00:00.000Z");
	});
});
