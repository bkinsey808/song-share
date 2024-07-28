"use client";

import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { getKeys } from "@/features/global/getKeys";

export const SongLibraryTitle = () => {
	const { getValue } = useDashboardState();
	const songLibrary = getValue(DashboardStateKey.SONG_LIBRARY);
	const numberOfSongs = getKeys(songLibrary).length;

	return (
		<>
			<div>Song Library{numberOfSongs ? `: ` : null}</div>
			<div className="overflow-hidden text-ellipsis text-nowrap">
				({numberOfSongs})
			</div>
		</>
	);
};
