import { playlistActiveSet } from "@/actions/playlistActiveSet";
import { toast } from "@/components/ui/use-toast";
import { ActionResultType } from "@/features/app-store/consts";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

type PlaylistActiveClick = (
	get: AppSliceGet,
	_set: AppSliceSet,
) => (playlistId: string) => () => Promise<void>;

export const playlistActiveClick: PlaylistActiveClick =
	(get, _set) => (playlistId) => async () => {
		const { fuid } = get();
		if (fuid) {
			return;
		}

		const playlistActiveResult = await playlistActiveSet(playlistId);
		if (playlistActiveResult.actionResultType === ActionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error setting the active playlist",
			});
			return;
		}
	};
