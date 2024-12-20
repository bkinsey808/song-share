import { playlistDelete } from "@/actions/playlistDelete";
import { toast } from "@/components/ui/use-toast";
import { actionResultType } from "@/features/app-store/consts";
import { AppSliceGet, AppSliceSet } from "@/features/app-store/types";

export const playlistDeleteConfirmClick =
	(get: AppSliceGet, set: AppSliceSet) => async () => {
		set({
			playlistDeletingIs: true,
		});
		const {
			playlistForm,
			playlistLibrary,
			playlistId,
			sessionCookieData,
			setOpenAppModal,
		} = get();
		const uid = sessionCookieData?.uid;
		if (!uid) {
			console.error("no uid");
		}
		if (!playlistForm) {
			console.error("no form");
			return;
		}
		if (!playlistId) {
			toast({
				variant: "destructive",
				title: "No playlist selected",
			});
			setOpenAppModal(null);
			return;
		}

		const result = await playlistDelete(playlistId);
		if (result.actionResultType === actionResultType.ERROR) {
			toast({
				variant: "destructive",
				title: "There was an error deleting the playlist",
			});
			setOpenAppModal(null);
			return;
		}

		delete playlistLibrary[playlistId];

		set({
			playlistId: null,
			playlistLibrary,
			playlistDeletingIs: false,
			playlistIds: result.playlistIds,
		});
		setOpenAppModal(null);
	};
