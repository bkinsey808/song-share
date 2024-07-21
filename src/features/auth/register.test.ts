import { flatten, safeParse } from "valibot";

import { RegistrationSchema } from "./schemas";

describe("register test", () => {
	it("parsing should work", () => {
		const data = {
			username: "",
			acceptTermsAndConditions: false,
		};
		const result = safeParse(RegistrationSchema, data);
		if (!result.success) {
			console.log(
				JSON.stringify(
					flatten<typeof RegistrationSchema>(result.issues).nested,
					null,
					2,
				),
			);
			expect(flatten<typeof RegistrationSchema>(result.issues).nested).toEqual({
				username: [
					"Username is required",
					"Username must be at least 3 characters",
				],
				acceptTermsAndConditions: ["You must accept the terms and conditions"],
			});
		}
	});
});
