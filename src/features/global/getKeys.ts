export const getKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];

export const getValues = Object.values as <T extends object>(
	obj: T,
) => T[keyof T][];
