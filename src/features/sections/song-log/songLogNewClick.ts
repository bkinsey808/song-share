import { UseFormReturn } from "react-hook-form";

import { songLogDefaultGet } from "./songLogDefaultGet";
import { SongLogForm } from "./types";
import { Get, Set } from "@/features/app-store/types";

export const songLogNewClick =
	(get: Get, set: Set) =>
	({
		form,
		songId,
	}: {
		form: UseFormReturn<SongLogForm>;
		songId?: string | null;
	}) =>
	() => {
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
				...songLogDefaultGet(),
				songId: songId ?? "",
			},
			{
				keepDirty: false,
			},
		);
	};
