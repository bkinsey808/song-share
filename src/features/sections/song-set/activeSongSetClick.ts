import { setActiveSongSet } from "@/actions/setActiveSongSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get } from "@/features/app-store/types";

export const activeSongSetClick =
	(get: Get) => (songSetId: string) => async () => {
		const { setActiveSongSetId } = get();

		const activeSongSetResult = await setActiveSongSet(songSetId);
		if (activeSongSetResult.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error setting the active song set",
			});
			return;
		}

		setActiveSongSetId(songSetId);
	};
