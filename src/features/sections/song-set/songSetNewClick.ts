import { Get, Set } from "@/features/app-store/types";

export const songSetNewClick = (get: Get, set: Set) => () => {
	const form = get().songSetForm;
	if (!form) {
		console.error("no form");
		return;
	}
	set({
		songSetId: null,
		songSetName: null,
	});
	form.reset({
		songSetName: "",
	});
};
