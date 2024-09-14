import { songAddToPlaylist } from "@/actions/songAddToPlaylist";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";

export const songAddToPlaylistClick = (get: Get, set: Set) => async () => {
	set({ addingSongToPlaylist: true });
	const { songId, playlistId } = get();

	try {
		if (!songId || !playlistId) {
			toast({
				variant: "destructive",
				title: "Cannot add song to song set",
			});
			return;
		}

		const result = await songAddToPlaylist({
			songId,
			playlistId,
		});

		if (result.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error adding song to song set",
			});
			return;
		}

		const { song, playlist } = result;

		set({ song, playlist });
	} catch (error) {
		toast({
			variant: "destructive",
			title: "There was an error adding song to song set",
		});
	}

	set({ addingSongToPlaylist: false });
};
