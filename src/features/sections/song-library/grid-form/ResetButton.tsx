import { JSX } from "react";

import { songLibrarySortDefault } from "./consts";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";

export const ResetButton = (): JSX.Element => {
	const { songLibraryGridForm, songLibraryGridFormResetOnClick } =
		useAppStore();

	return (
		<Button
			className="mb-[1rem] mt-[0.2rem]"
			disabled={
				!!songLibraryGridForm?.formState.isSubmitting ||
				(songLibraryGridForm?.getValues("sort") === songLibrarySortDefault &&
					songLibraryGridForm?.getValues("search") === "")
			}
			onClick={songLibraryGridFormResetOnClick}
		>
			Reset Search and Sort
		</Button>
	);
};
