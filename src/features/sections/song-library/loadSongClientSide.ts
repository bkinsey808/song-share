import { saveSong } from "@/actions/saveSong";
import { DashboardStateKey } from "@/app/d/enums";
import { GetValues, SetValues } from "@/app/d/types";

export const loadSongClientSide =
	({ setValues, getValues }: { setValues: SetValues; getValues: GetValues }) =>
	() => {
		void (async () => {
			setValues({ [DashboardStateKey.IS_LOADING_SONG]: true });

			const [songId] = getValues([DashboardStateKey.SONG_ID]);

			try {
				const result = await loadSong({
					songId,
				});

				if (result.result === "ERROR") {
					setValues({
						[DashboardStateKey.LOAD_SONG_ERROR]: result.message,
					});
				}
			} catch (error) {
				setValues({
					[DashboardStateKey.LOAD_SONG_ERROR]: "Error saving song",
				});
			}

			setValues({ [DashboardStateKey.IS_LOADING_SONG]: false });
		})();
	};
