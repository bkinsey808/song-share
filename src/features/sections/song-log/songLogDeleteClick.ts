import { UseFormReturn } from "react-hook-form";

import { songLogFormDefaultGet } from "./songLogFormDefaultGet";
import { SongLogForm } from "./types";
import { songLogDelete } from "@/actions/songLogDelete";
import { AppSliceGet } from "@/features/app-store/types";

type SongLogDeleteClick = (
	get: AppSliceGet,
) => ({
	songId,
	logId,
	form,
	shouldClearSongId,
}: {
	songId: string;
	logId: string;
	form: UseFormReturn<SongLogForm>;
	shouldClearSongId: boolean;
}) => () => void;

export const songLogDeleteClick: SongLogDeleteClick =
	(get) =>
	({ songId, logId, form, shouldClearSongId }) =>
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
						...songLogFormDefaultGet(),
						songId: shouldClearSongId || !songId ? "" : songId,
					});
				}

				return songDeleteResult;
			},
		});
	};
