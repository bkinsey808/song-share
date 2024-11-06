import { MouseEventHandler } from "react";

import { songRequestAdd } from "@/actions/songRequestAdd";
import { toast } from "@/components/ui/use-toast";
import { Get, Set } from "@/features/app-store/types";

export const songRequestAddClick = (set: Set, get: Get) => {
	return (songId: string) =>
		(e: Parameters<MouseEventHandler<HTMLButtonElement>>["0"]) => {
			e.preventDefault();

			const { sessionCookieData, songRequests, fuid } = get();
			const { uid } = sessionCookieData ?? {};

			if (!uid || !fuid) {
				return;
			}

			set({ songRequestPending: true });

			void (async () => {
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
					return;
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
