import { Get, Set } from "@/features/app-store/types";
import { useAuthStore } from "@/features/auth/useAuthStore";

export const songSetNewClick = (get: Get, set: Set) => () => {
	const username = useAuthStore.getState().sessionCookieData?.username;
	const form = get().songSetForm;
	if (!form) {
		console.error("no form");
		return;
	}
	set({
		songSetId: null,
		songSet: {
			songSetName: null,
			sharer: username ?? null,
		},
	});
	form.reset({
		songSetName: "",
	});
};
