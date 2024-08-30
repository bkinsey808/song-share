import { songActiveSet } from "@/actions/songActiveSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get } from "@/features/app-store/types";

export const songActiveClick =
	(get: Get) =>
	({ songId, songSetId }: { songId: string; songSetId: string }) =>
	async () => {
		const { fuid } = get();
		if (fuid) {
			return;
		}

		const activeSongResult = await songActiveSet({ songId, songSetId });
		if (activeSongResult.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error setting the active song",
			});
			return;
		}
	};
