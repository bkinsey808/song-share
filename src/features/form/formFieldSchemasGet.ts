import { BaseSchema } from "valibot";

import { getKeys } from "../global/getKeys";

export const formFieldSchemasGet = <T>(
	data: T extends Record<
		string,
		{
			label: string;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			schema: BaseSchema<any, any, any>;
		}
	>
		? T
		: never,
): {
	[key in keyof typeof data]: (typeof data)[key]["schema"];
} =>
	getKeys(data).reduce(
		(acc, key) => ({
			...acc,
			[key]: data[key].schema,
		}),
		{},
	) as {
		[key in keyof typeof data]: (typeof data)[key]["schema"];
	};
