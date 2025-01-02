import { songActiveSet } from "@/actions/songActiveSet";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/consts";
import { AppSliceGet } from "@/features/app-store/types";

type SongActiveClick = (
	get: AppSliceGet,
) => ({
	songId,
	playlistId,
}: {
	songId: string;
	playlistId?: string | undefined;
}) => () => Promise<void>;

export const songActiveClick: SongActiveClick =
	(get) =>
	({ songId, playlistId }) =>
	async () => {
		const { fuid } = get();
		if (fuid) {
			return;
		}

		const activeSongResult = await songActiveSet({ songId, playlistId });
		if (activeSongResult.actionResultType === ActionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error setting the active song",
			});
			return;
		}
	};
