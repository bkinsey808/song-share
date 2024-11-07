import { AppSlice } from "./useAppStore";

export type AppSliceGet = () => AppSlice;
export type AppSliceSet = (
	partial:
		| AppSlice
		| Partial<AppSlice>
		| ((state: AppSlice) => AppSlice | Partial<AppSlice>),
	replace?: boolean | undefined,
) => void;
