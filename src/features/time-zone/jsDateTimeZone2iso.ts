import { DateTime } from "luxon";

/** convert */
export const jsDateTimeZone2iso = (
	/** javascript date */
	date: Date | undefined,
	/** IANA timezone */
	timeZone: string | undefined | null,
): string | undefined => {
	if (!date || !timeZone) {
		return undefined;
	}
	const dt = DateTime.fromJSDate(date).setZone(timeZone);
	return dt.toISO() ?? undefined;
};
