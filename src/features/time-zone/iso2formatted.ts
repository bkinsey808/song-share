import { DateTime } from "luxon";

import { appDateTimeFormat } from "./consts";
import { jsDateTimeZone2iso } from "./jsDateTimeZone2iso";
import { Get } from "@/features/app-store/types";

/** formats according to app date time format */
export const iso2formatted = (get: Get) => (dateIso: string) => {
	const { timeZoneGet } = get();
	const timeZone = timeZoneGet();
	const localIso = jsDateTimeZone2iso(new Date(dateIso), timeZone);
	const localDt = localIso ? DateTime.fromISO(localIso) : undefined;
	return localDt ? localDt.toFormat(appDateTimeFormat) : undefined;
};
