"use client";

import { useSongLogs } from "./slice";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";

export const SongLogGrid = () => {
	const { songId, iso2formatted, songLogLoadClick, songLogForm } =
		useAppStore();
	const songLogs = useSongLogs(songId);

	if (!songId) {
		return null;
	}

	return (
		<Grid gridClassName="grid-cols-[12rem,2fr]">
			<GridHeader>
				<div>Song Log Date Time</div>
				<div>Notes</div>
			</GridHeader>
			{songLogs.map((songLog) => {
				const dateLocalFormatted = iso2formatted(songLog.date);

				return (
					<GridRow key={songLog.logId}>
						<Button
							variant="outline"
							className="min-h-[2rem] justify-start"
							onClick={songLogLoadClick({
								logId: songLog.logId,
								songId: songLog.songId,
								form: songLogForm,
							})}
							title="Open Song Log"
						>
							{dateLocalFormatted}
						</Button>
						<Button
							variant="outline"
							className="min-h-[2rem] justify-start"
							onClick={songLogLoadClick({
								logId: songLog.logId,
								songId: songLog.songId,
								form: songLogForm,
							})}
							title="Open Song Log"
						>
							{songLog.notes}
						</Button>
					</GridRow>
				);
			})}
		</Grid>
	);
};
