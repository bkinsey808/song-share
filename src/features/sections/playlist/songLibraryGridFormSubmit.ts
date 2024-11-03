import { FormEvent } from "react";

import { Get, Set } from "@/features/app-store/types";

export const songLibraryGridFormSubmit =
	(get: Get, set: Set) => async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { songLibraryGridForm } = get();

		if (!songLibraryGridForm) {
			console.error("no form");
			return;
		}

		return songLibraryGridForm.handleSubmit(async (songLibraryGridValues) => {
			const { sort, search } = songLibraryGridValues;
			set({
				songLibrarySort: sort,
				songLibrarySearch: search,
			});

			// reset isDirty back to false
			songLibraryGridForm.reset(
				{
					sort,
					search,
				},
				{ keepDirty: false },
			);
			return Promise.resolve();
		})();
	};
