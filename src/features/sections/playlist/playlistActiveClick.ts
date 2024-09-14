import { playlistActiveSet } from "@/actions/playlistActiveSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";

export const playlistActiveClick =
	(get: Get, _set: Set) => (playlistId: string) => async () => {
		const { fuid } = get();
		if (fuid) {
			return;
		}

		const playlistActiveResult = await playlistActiveSet(playlistId);
		if (playlistActiveResult.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error setting the active playlist",
			});
			return;
		}
	};
