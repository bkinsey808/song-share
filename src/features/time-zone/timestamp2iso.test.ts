import { Timestamp } from "firebase/firestore";

import { timestamp2iso } from "./timestamp2iso";

describe("timestamp2iso", () => {
	it("should return undefined if timestamp is undefined", () => {
		const result = timestamp2iso(undefined, "Asia/Tokyo");
		expect(result).toBeUndefined();
	});

	it("should convert a valid timestamp to ISO string in the specified time zone", () => {
		const exampleTimestamp = Timestamp.fromDate(
			new Date("2024-10-05T20:17:00Z"),
		);
		const targetTimeZone = "Asia/Tokyo";
		const result = timestamp2iso(exampleTimestamp, targetTimeZone);
		expect(result).toBe("2024-10-06T05:17:00.000+09:00");
	});

	it("should throw an error if the DateTime object is invalid", () => {
		const exampleTimestamp = Timestamp.fromDate(new Date("Invalid Date"));
		const targetTimeZone = "Asia/Tokyo";
		expect(() => timestamp2iso(exampleTimestamp, targetTimeZone)).toThrow(
			"Invalid DateTime object",
		);
	});

	it("should throw an error if the ISO string conversion fails", () => {
		const exampleTimestamp = Timestamp.fromDate(
			new Date("2024-10-05T20:17:00Z"),
		);
		const targetTimeZone = "Invalid/TimeZone";
		expect(() => timestamp2iso(exampleTimestamp, targetTimeZone)).toThrow(
			"Invalid Time Zone",
		);
	});
});
