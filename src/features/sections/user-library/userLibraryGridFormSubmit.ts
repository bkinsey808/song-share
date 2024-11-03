import { FormEvent } from "react";

import { Get, Set } from "@/features/app-store/types";

export const userLibraryGridFormSubmit =
	(get: Get, set: Set) => async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const { userLibraryGridForm } = get();

		if (!userLibraryGridForm) {
			console.error("no form");
			return;
		}

		return userLibraryGridForm.handleSubmit(
			async (communityUsersGridValues) => {
				const { sort, search } = communityUsersGridValues;
				set({
					userLibrarySort: sort,
					userLibrarySearch: search,
				});

				// reset isDirty back to false
				userLibraryGridForm.reset(
					{
						sort,
						search,
					},
					{ keepDirty: false },
				);
				return Promise.resolve();
			},
		)();
	};
