import { songActiveSet } from "@/actions/songActiveSet";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { Get } from "@/features/app-store/types";

export const songActiveClick =
	(get: Get) =>
	({
		songId,
		playlistId,
	}: {
		songId: string;
		playlistId?: string | undefined;
	}) =>
	async () => {
		const { fuid } = get();
		if (fuid) {
			return;
		}

		const activeSongResult = await songActiveSet({ songId, playlistId });
		if (activeSongResult.actionResultType === actionResultType.ERROR) {
			console.log({ activeSongResult });
			toast({
				variant: "destructive",
				title: "There was an error setting the active song",
			});
			return;
		}
	};
