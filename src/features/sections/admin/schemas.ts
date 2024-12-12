import { object } from "valibot";

import { backUpFormFieldData } from "./consts";
import { formFieldSchemasGet } from "@/features/form/formFieldSchemasGet";

export const BackUpFormSchema = object(
	formFieldSchemasGet(backUpFormFieldData),
);
