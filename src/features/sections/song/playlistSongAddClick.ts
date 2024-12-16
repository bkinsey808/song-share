import { toast } from "@/components/ui/use-toast";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const playlistSongAddClick =
	(get: AppSliceGet, set: AppSliceSet) =>
	({ songId, playlistId }: { songId?: string; playlistId?: string }) =>
	() => {
		set({ playlistSongAdding: true });
		const {
			songId: songIdCurrent,
			playlistId: playlistIdCurrent,
			playlistForm,
			playlistGridForm,
			playlistIsUnsavedSet,
		} = get();
		try {
			songId = songId ?? songIdCurrent ?? undefined;
			playlistId = playlistId ?? playlistIdCurrent ?? undefined;

			if (!songId || !playlistId) {
				toast({
					variant: "destructive",
					title: "Cannot add song to playlist",
				});
				return;
			}

			const playlist = get().playlistLibrary[playlistId];

			if (!playlist) {
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
