import { Log } from "./types";
import { jsDateTimeZone2iso } from "@/features/time-zone/jsDateTimeZone2iso";

export const logDefaultGet = () => {
	const defaultLog: Log = {
		songId: "",
		notes: "",
		date: jsDateTimeZone2iso(new Date(), "UTC") ?? "",
	};
	return defaultLog;
};
