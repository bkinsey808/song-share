import { safeParse } from "valibot";

export const serverParse: typeof safeParse = (schema, data, options) => {
	if (process.env.SKIP_SERVER_PARSE) {
		return { success: true, output: data } as ReturnType<typeof safeParse>;
	}
	return safeParse(schema, data, options);
};
