import { Get } from "@/features/app-store/types";
import { getValues } from "@/features/global/getKeys";

export const songLibraryUnsubscribe = (get: Get) => () => {
	const { songUnsubscribeFns } = get();
	getValues(songUnsubscribeFns).forEach((unsubscribeFn) => {
		unsubscribeFn();
	});
};
