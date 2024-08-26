"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { getKeys } from "@/features/global/getKeys";

export const SongLibrarySection = () => {
	const { songLibrary, usernameGet, songLoadClick } = useAppStore();
	const songIds = getKeys(songLibrary);

	return (
		<section data-title="Song Library Section" className="p-[1rem]">
			<Grid gridClassName="grid-cols-[3fr,2fr,1fr]">
				<GridHeader>
					<div>Song Name</div>
					<div>Sharer</div>
					<div>Options</div>
				</GridHeader>
				{songIds.map((songId) => (
					<GridRow key={songId}>
						<div>{songLibrary[songId].songName}</div>
						<div>{usernameGet(songLibrary[songId].sharer)}</div>
						<div>
							<Button onClick={songLoadClick(songId)}>Load</Button>
						</div>
					</GridRow>
				))}
			</Grid>
		</section>
	);
};
