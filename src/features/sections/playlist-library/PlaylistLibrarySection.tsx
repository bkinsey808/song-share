"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { getKeys } from "@/features/global/getKeys";

export const PlaylistLibrarySection = () => {
	const {
		playlistLibrary,
		playlistLoadClick,
		playlistActiveId,
		playlistActiveClick,
	} = useAppStore();
	const playlistIds = getKeys(playlistLibrary);

	return (
		<section data-title="Playlist Library Section">
			Playlist Active Id: {playlistActiveId}
			<Grid gridClassName="grid-cols-[1.5rem,3fr,1fr]">
				<GridHeader>
					<div></div>
					<div>Playlist Name</div>
					<div>Options</div>
				</GridHeader>
				<RadioGroup
					name="playlistActiveId"
					id="playlistActiveId"
					value={playlistActiveId ?? ""}
				>
					{playlistIds.map((playlistId) => (
						<GridRow key={playlistId}>
							<div className="align-center grid justify-center">
								<RadioGroupItem
									className="self-center"
									id={playlistId}
									value={playlistId}
									onClick={playlistActiveClick(playlistId)}
								/>
							</div>
							<Button
								variant="outline"
								className="min-h-[2rem] w-full justify-start"
								onClick={playlistLoadClick(playlistId)}
								title="Load playlist"
							>
								{playlistLibrary[playlistId].playlistName}
							</Button>
						</GridRow>
					))}
				</RadioGroup>
			</Grid>
		</section>
	);
};
