import { setActiveSong } from "@/actions/setActiveSong";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get } from "@/features/app-store/types";

export const activeSongClick = (get: Get) => (songId: string) => async () => {
	const { setActiveSongId } = get();

	const activeSongResult = await setActiveSong(songId);
	if (activeSongResult.actionResultType === actionResultType.ERROR) {
		toast({
			variant: "destructive",
			title: "There was an error setting the active song",
		});
		return;
	}

	setActiveSongId(songId);
};
