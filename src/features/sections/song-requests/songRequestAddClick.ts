import { MouseEventHandler } from "react";

import { songRequestAdd } from "@/actions/songRequestAdd";
import { toast } from "@/components/ui/use-toast";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const songRequestAddClick = (set: AppSliceSet, get: AppSliceGet) => {
	return (songId: string) =>
		(e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]): void => {
			e.preventDefault();

			const { sessionCookieData, fuid } = get();
			const { uid } = sessionCookieData ?? {};

			if (!uid) {
				return;
			}

			set({ songRequestPending: true });

			void (async (): Promise<void> => {
				// Add song to song requests
				const songRequestAddResult = await songRequestAdd({
					songId,
					fuid,
				});

				if (songRequestAddResult.actionResultType === "ERROR") {
					set({ songRequestPending: false });
					toast({
						variant: "destructive",
						title: songRequestAddResult.message,
					});
				} else {
					set({
						songRequestPending: false,
						songRequests: songRequestAddResult.songRequests,
					});
					toast({
						title: "Song requested successfully",
					});
				}
			})();
		};
};
