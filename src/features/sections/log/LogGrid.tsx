"use client";

import { JSX } from "react";

import { useSongLogs } from "../song-log/slice";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { tw } from "@/features/global/tw";

export const LogGrid = (): JSX.Element => {
	const {
		songLogLoadClick,
		songLoadClick,
		songNameGet,
		logForm,
		iso2formatted,
	} = useAppStore();

	const songLogs = useSongLogs();

	return (
		<div data-title="Log Grid">
			<Grid gridClassName={tw`grid-cols-[8.5rem,2fr]`}>
				<GridHeader>
					<div>Log Date Time</div>
					<div>Song Name</div>
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
									form: logForm,
								})}
								title="Open log"
							>
								<pre>{dateLocalFormatted}</pre>
							</Button>
							<Button
								variant="outline"
								className="min-h-[2rem] justify-start"
								onClick={songLoadClick(songLog.songId)}
								title="Open song"
							>
								{songNameGet(songLog.songId)}
							</Button>
						</GridRow>
					);
				})}
			</Grid>
		</div>
	);
};
