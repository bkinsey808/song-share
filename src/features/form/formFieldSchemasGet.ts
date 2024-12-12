import { BaseSchema } from "valibot";

import { getKeys } from "../global/getKeys";

export const formFieldSchemasGet = <T>(
	data: T extends {
		[key: string]: {
			label: string;
			schema: BaseSchema<any, any, any>;
		};
	}
		? T
		: never,
) =>
	getKeys(data).reduce(
		(acc, key) => ({
			...acc,
			[key]: data[key].schema,
		}),
		{},
	) as {
		[key in keyof typeof data]: (typeof data)[key]["schema"];
	};
