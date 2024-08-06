"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { getKeys } from "@/features/global/getKeys";

export const SongSetLibrarySection = () => {
	const { songSetLibrary, songSetLoadClick } = useAppStore();
	const songSetIds = getKeys(songSetLibrary);

	return (
		<section data-title="Song Set Library Section" className="p-[1rem]">
			<Grid gridClassName="grid-cols-[3fr,2fr,1fr]">
				<GridHeader>
					<div>Song Set Name</div>
					<div>Sharer</div>
					<div>Options</div>
				</GridHeader>
				{songSetIds.map((songSetId) => (
					<GridRow key={songSetId}>
						<div>{songSetLibrary[songSetId].songSetName}</div>
						<div>{songSetLibrary[songSetId].sharer}</div>
						<div>
							<Button onClick={songSetLoadClick(songSetId)}>Load</Button>
						</div>
					</GridRow>
				))}
			</Grid>
		</section>
	);
};
