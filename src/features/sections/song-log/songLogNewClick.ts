import { UseFormReturn } from "react-hook-form";

import { songLogFormDefaultGet } from "./songLogFormDefaultGet";
import { SongLogForm } from "./types";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const songLogNewClick =
	(get: AppSliceGet, set: AppSliceSet) =>
	({
		form,
		songId,
	}: {
		form: UseFormReturn<SongLogForm>;
		songId?: string | null;
	}) =>
	(): void => {
		const { sessionCookieData } = get();
		const uid = sessionCookieData?.uid;
		if (!uid) {
			console.error("no uid");
			return;
		}

		if (!form) {
			console.error("no form");
			return;
		}

		set({
			songLogId: null,
		});

		form.reset(
			{
				...songLogFormDefaultGet(),
				songId: songId ?? "",
			},
			{
				keepDirty: false,
			},
		);
	};
