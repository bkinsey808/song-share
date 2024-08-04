"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { getKeys } from "@/features/global/getKeys";

export const SongLibrarySection = () => {
	const { songLibrary, songLoadClick } = useAppStore();
	const songIds = getKeys(songLibrary);

	return (
		<section data-title="Song Library Section">
			<div className="p-[1rem]">
				<div className="grid grid-flow-col grid-cols-[3fr,2fr,1fr] border-b">
					<div>Song Name</div>
					<div>Sharer</div>
					<div>Options</div>
				</div>

				{songIds.map((songId) => (
					<div
						key={songId}
						className="grid grid-flow-col grid-cols-[3fr,2fr,1fr]"
					>
						<div>{songLibrary[songId].songName}</div>
						<div>{songLibrary[songId].sharer}</div>
						<div>
							<Button
								onClick={(e) => {
									console.log(e);
									return songLoadClick(songId)(e);
								}}
							>
								Load
							</Button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};
