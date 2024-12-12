import { object, string } from "valibot";

import { backUpFormFieldKey } from "./consts";

export const BackUpFormSchema = object({
	[backUpFormFieldKey.FROM_PREFIX]: string(),
	[backUpFormFieldKey.TO_PREFIX]: string(),
});
