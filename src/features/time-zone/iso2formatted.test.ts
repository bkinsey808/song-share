import { DateTime } from "luxon";

import { appDateTimeFormat } from "./consts";
import { iso2formatted } from "./iso2formatted";
import { AppSliceGet } from "@/features/app-store/types";

describe("iso2formatted", () => {
	const mockGet: AppSliceGet = () =>
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		({
			timeZoneGet: jest.fn().mockReturnValue("America/New_York"),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		}) as any;

	it("should format ISO date string according to app date time format", () => {
		const dateIso = "2023-10-10T14:48:00.000Z";
		const formattedDate = iso2formatted(mockGet)(dateIso);
		const expectedDate = DateTime.fromISO(
			"2023-10-10T10:48:00.000-04:00",
		).toFormat(appDateTimeFormat);

		expect(formattedDate).toBe(expectedDate);
	});

	it("should return undefined for invalid ISO date string", () => {
		const dateIso = "invalid-date";
		const formattedDate = iso2formatted(mockGet)(dateIso);

		expect(formattedDate).toBeUndefined();
	});

	it("should return undefined if localIso is undefined", () => {
		const mockGetWithInvalidTimeZone: AppSliceGet = () =>
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			({
				timeZoneGet: jest.fn().mockReturnValue("Invalid/TimeZone"),
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			}) as any;
		const dateIso = "2023-10-10T14:48:00.000Z";
		const formattedDate = iso2formatted(mockGetWithInvalidTimeZone)(dateIso);

		expect(formattedDate).toBeUndefined();
	});
});
