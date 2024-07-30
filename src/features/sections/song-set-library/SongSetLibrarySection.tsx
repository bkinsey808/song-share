"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const SongSetLibrarySection = () => {
	const { songSetLibrary, songSetLoadClick } = useAppStore();
	const songSetIds = getKeys(songSetLibrary);

	return (
		<section data-title="SongSet Library Section">
			<div className="p-[1rem]">
				<div className="grid grid-flow-col grid-cols-[3fr,2fr,1fr] border-b">
					<div>SongSet Name</div>
					<div>Sharer</div>
					<div>Options</div>
				</div>

				{songSetIds.map((songSetId) => (
					<div
						key={songSetId}
						className="grid grid-flow-col grid-cols-[3fr,2fr,1fr]"
					>
						<div>{songSetLibrary[songSetId].songSetName}</div>
						<div>{songSetLibrary[songSetId].sharer}</div>
						<div>
							<Button onClick={songSetLoadClick(songSetId)}>Load</Button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
