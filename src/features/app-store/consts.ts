export const ActionResultType = {
	ERROR: "ERROR",
	SUCCESS: "SUCCESS",
} as const;

export type ActionResultTypeType =
	(typeof ActionResultType)[keyof typeof ActionResultType];
