import { FormEvent } from "react";

import { Get, Set } from "@/features/app-store/types";

export const songRequestsGridFormSubmit =
	(get: Get, set: Set) => async (e: FormEvent<HTMLFormElement>) => {
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
