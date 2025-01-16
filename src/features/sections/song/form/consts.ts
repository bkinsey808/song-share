import { keys } from "../consts";
import { getKeys } from "@/features/global/getKeys";

export const keyOptions = getKeys(keys).map((key) => {
	return {
		value: key,
		label: key,
		search: `${key.toLocaleLowerCase()}`,
	};
});

export const keyOptionsWithNone = [
	{
		value: "",
		label: "None",
		search: "None",
	},
	...keyOptions,
];
