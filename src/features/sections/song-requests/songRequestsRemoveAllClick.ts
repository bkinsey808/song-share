import { MouseEventHandler } from "react";

import { songRequestsRemoveAll } from "@/actions/songRequestsRemoveAll";
import { toast } from "@/components/ui/use-toast";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const songRequestsRemoveAllClick = (
	set: AppSliceSet,
	get: AppSliceGet,
) => {
	return (songId: string) =>
		(e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
			e.preventDefault();
			const { confirmModalOpen } = get();
			confirmModalOpen({
				heading: "Remove All Song Requests from this Song",
				buttonLabel: "Remove All",
				content:
					"Are you sure you want to remove all song requests from this song?",
				confirmFn: async () => {
					const songRequestsRemoveAllResult =
						await songRequestsRemoveAll(songId);

					if (songRequestsRemoveAllResult.actionResultType === "SUCCESS") {
						toast({
							title: "Song requests for song remove successfully",
						});
					}
					return songRequestsRemoveAllResult;
				},
			});
		};
};
