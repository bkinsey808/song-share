import { Playlist } from "../playlist/types";
import { toast } from "@/components/ui/use-toast";
import { Get, Set } from "@/features/app-store/types";

export const songAddToPlaylistClick = (get: Get, set: Set) => () => {
	set({ addingSongToPlaylist: true });
	const { songId, playlistId, playlistForm, playlist, playlistIsUnsavedSet } =
		get();

	try {
		if (!songId || !playlistId || !playlist) {
			toast({
				variant: "destructive",
				title: "Cannot add song to playlist",
			});
			return;
		}

		playlist.songs = [...(playlist.songs ?? []), { songId }];
		playlistForm?.reset(playlist as Playlist);
		playlistIsUnsavedSet(true);
	} catch (error) {
		toast({
			variant: "destructive",
			title: "There was an error adding song to playlist",
		});
	}

	set({ addingSongToPlaylist: false });
};
