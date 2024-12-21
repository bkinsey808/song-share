import { minLength, nonEmpty, pipe, string } from "valibot";

export const backUpFormFieldKey = {
	FROM_PREFIX: "fromPrefix",
	TO_PREFIX: "toPrefix",
} as const;

export const backUpFormFieldData = {
	[backUpFormFieldKey.FROM_PREFIX]: {
		label: "From Prefix",
		schema: pipe(
			string(),
			nonEmpty("From prefix is required"),
			minLength(3, "From prefix must be at least 3 characters"),
		),
	},
	[backUpFormFieldKey.TO_PREFIX]: {
		label: "To Prefix",
		schema: pipe(
			string(),
			nonEmpty("To prefix is required"),
			minLength(3, "To prefix must be at least 3 characters"),
		),
	},
};
