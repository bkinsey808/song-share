import { FormEvent } from "react";

import { songLibrarySortDefault } from "./consts";
import { AppSliceGet } from "@/features/app-store/types";

type ResetOnClick = (get: AppSliceGet) => () => void;

export const resetOnClick: ResetOnClick = (get) => () => {
	const { songLibraryGridForm, songLibraryGridFormSubmit } = get();
	songLibraryGridForm?.reset({
		sort: songLibrarySortDefault,
		search: "",
	});
	const formEvent = new Event("submit", {
		bubbles: true,
		cancelable: true,
	});
	void songLibraryGridFormSubmit(
		formEvent as unknown as FormEvent<HTMLFormElement>,
	);
};
