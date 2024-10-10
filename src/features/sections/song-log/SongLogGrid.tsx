"use client";

import { useSongLogIds } from "./slice";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";

export const SongLogGrid = () => {
	const { songId, logs, iso2formatted, songLogLoadClick } = useAppStore();
	const songLogIds = useSongLogIds(songId);

	return (
		<Grid gridClassName="grid-cols-[12rem,2fr]">
			<GridHeader>
				<div>Song Log Date Time</div>
				<div>Notes</div>
			</GridHeader>
			{songLogIds.map((logId) => {
				const log = logs[logId];
				const dateLocalFormatted = iso2formatted(log.date);

				return (
					<GridRow key={logId}>
						<Button
							variant="outline"
							className="min-h-[2rem] justify-start"
							onClick={songLogLoadClick(logId)}
						>
							{dateLocalFormatted}
						</Button>
						<Button
							variant="outline"
							className="min-h-[2rem] justify-start"
							onClick={songLogLoadClick(logId)}
						>
							{log.notes}
						</Button>
					</GridRow>
				);
			})}
		</Grid>
	);
};
