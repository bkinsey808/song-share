import { SongLogForm } from "./types";
import { jsDateTimeZone2iso } from "@/features/time-zone/jsDateTimeZone2iso";

export const songLogFormDefaultGet = (): SongLogForm => {
	const defaultLog: SongLogForm = {
		logId: "",
		songId: "",
		notes: "",
		date: jsDateTimeZone2iso(new Date(), "UTC") ?? "",
	};
	return defaultLog;
};
