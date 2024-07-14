export const getKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];
