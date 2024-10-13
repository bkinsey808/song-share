import { toast } from "@/components/ui/use-toast";
import { Get, Set } from "@/features/app-store/types";

export const playlistSongAddClick = (get: Get, set: Set) => () => {
	set({ playlistSongAdding: true });
	const {
		songId,
		playlistId,
		playlistForm,
		playlistGridForm,
		playlistIsUnsavedSet,
	} = get();
	try {
		if (!songId || !playlistId) {
			toast({
				variant: "destructive",
				title: "Cannot add song to playlist",
			});
			return;
		}

		const playlist = get().playlistLibrary[playlistId];

		if (!songId || !playlistId || !playlist) {
			toast({
				variant: "destructive",
				title: "Cannot add song to playlist",
			});
			return;
		}

		playlist.songs = [...(playlist.songs ?? []), { songId }];
		const { songs, ...playlistData } = playlist;
		playlistForm?.reset({
			playlistName: playlistData.playlistName ?? "",
			sharer: playlistData.sharer ?? "",
		});
		playlistGridForm?.setValue("songs", songs, { shouldDirty: true });

		playlistIsUnsavedSet(true);
	} catch (error) {
		toast({
			variant: "destructive",
			title: "There was an error adding song to playlist",
		});
	}

	set({ playlistSongAdding: false });
};
