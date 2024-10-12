"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";

export const LogGrid = () => {
	const {
		logs,
		logIds,
		logLoadClick,
		songLoadClick,
		songNameGet,
		iso2formatted,
	} = useAppStore();
	return (
		<div data-title="Log Grid">
			<Grid gridClassName="grid-cols-[12rem,2fr]">
				<GridHeader>
					<div>Log Date Time</div>
					<div>Song Name</div>
				</GridHeader>
				{logIds.map(({ logId }) => {
					const log = logs[logId];
					const dateLocalFormatted = iso2formatted(log.date);

					return (
						<GridRow key={logId}>
							<Button
								variant="outline"
								className="min-h-[2rem] justify-start"
								onClick={logLoadClick(logId)}
								title="Open log"
							>
								{dateLocalFormatted}
							</Button>
							<Button
								variant="outline"
								className="min-h-[2rem] justify-start"
								onClick={songLoadClick(log.songId)}
								title="Open song"
							>
								{songNameGet(log.songId)}
							</Button>
						</GridRow>
					);
				})}
			</Grid>
		</div>
	);
};
