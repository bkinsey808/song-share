import { songAddToSongSet } from "@/actions/songAddToSongSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";

export const songAddToSongSetClick = (get: Get, set: Set) => async () => {
	set({ addingSongToSongSet: true });
	const { songId, songSetId } = get();

	try {
		if (!songId || !songSetId) {
			toast({
				variant: "destructive",
				title: "Cannot add song to song set",
			});
			return;
		}

		const result = await songAddToSongSet({
			songId,
			songSetId,
		});

		if (result.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error adding song to song set",
			});
			return;
		}

		const { song, songSet } = result;

		set({ song, songSet });
	} catch (error) {
		toast({
			variant: "destructive",
			title: "There was an error adding song to song set",
		});
	}

	set({ addingSongToSongSet: false });
};
