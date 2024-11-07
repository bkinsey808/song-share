import { UseFormReturn } from "react-hook-form";

import { songLogDefaultGet } from "./songLogDefaultGet";
import { SongLogForm } from "./types";
import { songLogDelete } from "@/actions/songLogDelete";
import { AppSliceGet } from "@/features/app-store/types";

export const songLogDeleteClick =
	(get: AppSliceGet) =>
	({
		songId,
		logId,
		form,
		shouldClearSongId,
	}: {
		songId: string;
		logId: string;
		form: UseFormReturn<SongLogForm>;
		shouldClearSongId: boolean;
	}) =>
	() => {
		const { confirmModalOpen } = get();
		confirmModalOpen({
			heading: "Delete Song Log",
			buttonLabel: "Delete",
			content: "Are you sure you want to delete this song log?",
			confirmFn: async () => {
				const songDeleteResult = await songLogDelete({
					songId,
					logId,
				});

				if (songDeleteResult.actionResultType === "SUCCESS") {
					form.reset({
						...songLogDefaultGet(),
						songId: shouldClearSongId || !songId ? "" : songId,
					});
				}

				return songDeleteResult;
			},
		});
	};
