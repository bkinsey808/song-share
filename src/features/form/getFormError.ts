import { flatten } from "valibot";

import { ActionResultType } from "@/features/app-store/consts";

export const getFormError = (
	formError: string,
): {
	actionResultType: "ERROR";
	formError: string;
	fieldErrors: ReturnType<typeof flatten>["nested"];
} => {
	console.error(formError);
	return {
		actionResultType: ActionResultType.ERROR,
		formError,
		fieldErrors: [],
	};
};
