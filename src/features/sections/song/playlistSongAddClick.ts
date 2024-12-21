import { toast } from "@/components/ui/use-toast";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const playlistSongAddClick =
	(get: AppSliceGet, set: AppSliceSet) =>
	(options?: { songId?: string; playlistId?: string }) =>
	() => {
		set({ playlistSongAdding: true });
		const { playlistForm, playlistGridForm, playlistIsUnsavedSet } = get();
		const songIdCurrent = get().songId;
		const playlistIdCurrent = get().playlistId;
		try {
			const {
				songId = songIdCurrent ?? undefined,
				playlistId = playlistIdCurrent ?? undefined,
			} = options ?? {};

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
