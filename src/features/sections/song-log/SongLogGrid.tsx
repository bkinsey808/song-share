"use client";

import { JSX } from "react";

import { useSongLogs } from "./slice";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { tw } from "@/features/global/tw";

export const SongLogGrid = (): JSX.Element | null => {
	const { songId, iso2formatted, songLogLoadClick, songLogForm } =
		useAppStore();
	const songLogs = useSongLogs(songId);

	if (!songId) {
		return null;
	}

	return (
		<Grid gridClassName={tw`grid-cols-[8rem,2fr]`}>
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
							<pre>{dateLocalFormatted}</pre>
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
