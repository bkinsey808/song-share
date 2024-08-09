import { AppSlice } from "./useAppStore";

export type Get = () => AppSlice;
export type Set = (
	partial:
		| AppSlice
		| Partial<AppSlice>
		| ((state: AppSlice) => AppSlice | Partial<AppSlice>),
	replace?: boolean | undefined,
) => void;
