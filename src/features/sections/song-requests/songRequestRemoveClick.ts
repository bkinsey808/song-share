import { MouseEventHandler } from "react";

import { songRequestRemove } from "@/actions/songRequestRemove";
import { toast } from "@/components/ui/use-toast";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const songRequestRemoveClick = (set: AppSliceSet, get: AppSliceGet) => {
	return (songId: string) =>
		(e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
			e.preventDefault();

			const { sessionCookieData, fuid } = get();
			const { uid } = sessionCookieData ?? {};

			if (!uid) {
				return;
			}

			set({ songRequestPending: true });

			void (async () => {
				// Add song to song requests
				const songRequestRemoveResult = await songRequestRemove({
					songId,
					fuid,
				});

				if (songRequestRemoveResult.actionResultType === "ERROR") {
					set({ songRequestPending: false });
					toast({
						variant: "destructive",
						title: songRequestRemoveResult.message,
					});
					return;
				} else {
					set({
						songRequestPending: false,
						songRequests: songRequestRemoveResult.songRequests,
					});
					toast({
						title: "Song request cancelled successfully",
					});
				}
			})();
		};
};
