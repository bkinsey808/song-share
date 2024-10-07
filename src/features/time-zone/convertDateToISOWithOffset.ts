import { DateTime } from "luxon";

export const convertDateToISOWithOffset = (
	date: Date | undefined,
	timeZone: string | undefined | null,
): string | undefined => {
	if (!date || !timeZone) {
		return undefined;
	}
	const dt = DateTime.fromJSDate(date).setZone(timeZone);
	return dt.toISO() ?? undefined;
};
