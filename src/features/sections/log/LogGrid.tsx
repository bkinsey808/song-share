"use client";

import { DateTime } from "luxon";

import { LogDeleteConfirmModal } from "./LogDeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { convertDateToISOWithOffset } from "@/features/time-zone/convertDateToISOWithOffset";

export const LogGrid = () => {
	const { logs, logIds, logLoadClick, songLibrary, timeZone } = useAppStore();
	return (
		<div data-title="Log Grid">
			<LogDeleteConfirmModal />
			<Grid gridClassName="grid-cols-[1fr,2fr]">
				<GridHeader>
					<div>Log Date Time</div>
					<div>Song Name</div>
				</GridHeader>
				{logIds.map((logId) => {
					const log = logs[logId.logId];
					const localIso = convertDateToISOWithOffset(
						new Date(log.date),
						// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
						timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
					);
					const localDt = localIso ? DateTime.fromISO(localIso) : undefined;
					const formattedLocalDate = localDt
						? localDt.toFormat("yyyy/MM/dd HH:mm")
						: "";

					return (
						<GridRow key={logId.logId}>
							<div>{formattedLocalDate}</div>
							<Button
								variant="outline"
								className="min-h-[2rem] w-full justify-start"
								onClick={logLoadClick(logId.logId)}
							>
								{songLibrary[log.songId]?.songName}
							</Button>
						</GridRow>
					);
				})}
			</Grid>
		</div>
	);
};
