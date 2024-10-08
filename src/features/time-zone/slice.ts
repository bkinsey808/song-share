import { StateCreator } from "zustand";

import { iso2formatted } from "./iso2formatted";
import { AppSlice, sliceResetFns } from "@/features/app-store/useAppStore";

/** IANA timezone format @see https://timeapi.io/documentation/iana-timezones#:~:text=These%20IANA%20Time%20Zones%20are,a%20location%20within%20the%20continent. */
type TimeZoneSliceState = {
	/** IANA timezone format */
	timeZone: string | null;
};

type AppTimeZoneSlice = StateCreator<AppSlice, [], [], TimeZoneSlice>;

const timeZoneSliceInitialState: TimeZoneSliceState = {
	timeZone: null,
};

export type TimeZoneSlice = TimeZoneSliceState & {
	/** gets settings time zone if set, else system timezone */
	timeZoneGet: () => string;
	/** formats according to app date time format */
	iso2formatted: (date: string) => string | undefined;
};

export const createTimeZoneSlice: AppTimeZoneSlice = (set, get) => {
	sliceResetFns.add(() => set(timeZoneSliceInitialState));
	return {
		...timeZoneSliceInitialState,
		timeZoneGet: () =>
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			get().timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
		iso2formatted: iso2formatted(get),
	};
};
