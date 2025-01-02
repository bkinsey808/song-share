import { FormEvent } from "react";

import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type SongLibraryGridFormSubmit = (
	get: AppSliceGet,
	set: AppSliceSet,
) => (e: FormEvent<HTMLFormElement>) => Promise<void>;

export const songLibraryGridFormSubmit: SongLibraryGridFormSubmit =
	(get, set) => async (e) => {
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
