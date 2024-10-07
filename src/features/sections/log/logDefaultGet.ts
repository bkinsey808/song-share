import { Log } from "./types";
import { convertDateToISOWithOffset } from "@/features/time-zone/convertDateToISOWithOffset";

export const logDefaultGet = () => {
	const defaultLog: Log = {
		songId: "",
		notes: "",
		date: convertDateToISOWithOffset(new Date(), "UTC") ?? "",
	};
	return defaultLog;
};
