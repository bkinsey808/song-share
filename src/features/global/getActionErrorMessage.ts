import { ActionResultType } from "../app-store/enums";

export const getActionErrorMessage = (message: string) => ({
	actionResultType: ActionResultType.ERROR as const,
	message,
});
