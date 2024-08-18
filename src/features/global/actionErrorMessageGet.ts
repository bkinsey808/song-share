import { actionResultType } from "../app-store/consts";

export const actionErrorMessageGet = (message: string) => {
	console.error(message);
	return {
		actionResultType: actionResultType.ERROR,
		message,
	};
};
