import { Get } from "@/features/app-store/types";
import { getValues } from "@/features/global/getKeys";

export const songSetLibraryUnsubscribe = (get: Get) => () => {
	const { songSetUnsubscribeFns } = get();
	getValues(songSetUnsubscribeFns).forEach((unsubscribeFn) => {
		unsubscribeFn();
	});
};
