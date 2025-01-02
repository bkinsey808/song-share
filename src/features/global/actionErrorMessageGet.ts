import { ActionResultType } from "@/features/app-store/consts";

export const actionErrorMessageGet = (
	message: string,
): {
	actionResultType: (typeof ActionResultType)["ERROR"];
	message: string;
} => {
	console.error(message);
	return {
		actionResultType: ActionResultType.ERROR,
		message,
	};
};
