import { songSetActiveSet } from "@/actions/songSetActiveSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get, Set } from "@/features/app-store/types";

export const songSetActiveClick =
	(get: Get, _set: Set) => (songSetId: string) => async () => {
		const { fuid } = get();
		if (fuid) {
			return;
		}

		const songSetActiveResult = await songSetActiveSet(songSetId);
		if (songSetActiveResult.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error setting the active song set",
			});
			return;
		}
	};
