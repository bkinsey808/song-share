import { actionResultType } from "../app-store/consts";

export const getActionErrorMessage = (message: string) => {
	console.error(message);
	return {
		actionResultType: actionResultType.ERROR,
		message,
	};
};
