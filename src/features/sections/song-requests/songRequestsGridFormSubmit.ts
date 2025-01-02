import { FormEvent } from "react";

import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const songRequestsGridFormSubmit =
	(get: AppSliceGet, set: AppSliceSet) =>
	async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		const { songRequestsGridForm } = get();

		if (!songRequestsGridForm) {
			console.error("no form");
			return;
		}

		return songRequestsGridForm.handleSubmit(async (songRequestsGridValues) => {
			const { sort, search } = songRequestsGridValues;
			set({
				songRequestsSort: sort,
				songRequestsSearch: search,
			});

			// reset isDirty back to false
			songRequestsGridForm.reset(
				{
					sort,
					search,
				},
				{ keepDirty: false },
			);
			return Promise.resolve();
		})();
	};
