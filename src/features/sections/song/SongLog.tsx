import { sectionId } from "../consts";
import { SongLogTitle } from "./SongLogTitle";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { SectionAccordion } from "@/features/section/SectionAccordion";

export const SongLog = () => {
	const { songId, songLogIdsGet, logs, iso2formatted } = useAppStore();
	const songLogIds = songLogIdsGet(songId);

	return (
		<SectionAccordion
			sectionId={sectionId.SONG_LOG}
			title={<SongLogTitle />}
			buttonLabel="Song Log"
			buttonVariant="secondary"
		>
			<Grid gridClassName="grid-cols-[12rem,2fr]">
				<GridHeader>
					<div>Song Log Date Time</div>
					<div>Notes</div>
				</GridHeader>
				{songLogIds.map((logId) => {
					const log = logs[logId];
					console.log({ log });
					const dateLocalFormatted = iso2formatted(log.date);

					return (
						<GridRow key={logId}>
							<div>{dateLocalFormatted}</div>
							<div>{log.notes}</div>
						</GridRow>
					);
				})}
			</Grid>
		</SectionAccordion>
	);
};
