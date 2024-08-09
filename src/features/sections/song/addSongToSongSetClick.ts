import { songAddToSongSet } from "@/actions/songAddToSongSet";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/enums";
import { Get, Set } from "@/features/app-store/types";

export const addSongToSongSetClick = (get: Get, set: Set) => async () => {
	set({ addingSongToSongSet: true });
	const { songId, song, songSetId, sessionCookieData } = get();

	try {
		if (!songId || !song || !songSetId) {
			toast({
				variant: "destructive",
				title: "Cannot add song to song set",
			});
			return;
		}
		const result = await songAddToSongSet({
			songId,
			song: {
				songName: song.songName ?? "",
				sharer: song.sharer ?? sessionCookieData?.username ?? "",
				credits: song.credits ?? "",
				lyrics: song.lyrics ?? "",
				translation: song.translation ?? "",
			},
			songSetId,
		});

		if (result.actionResultType === ActionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error adding song to song set",
			});
			return;
		}

		const newSongSet = result.songSet;

		if (!newSongSet) {
			toast({
				variant: "destructive",
				title: "There was an error adding song to song set",
			});
			return;
		}

		set({ songSet: newSongSet });
	} catch (error) {
		toast({
			variant: "destructive",
			title: "There was an error adding song to song set",
		});
	}

	set({ addingSongToSongSet: true });
};
