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
		<section data-title="Playlist Library Section" className="p-[1rem]">
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
							<RadioGroupItem
								className="self-center"
								id={playlistId}
								value={playlistId}
								onClick={playlistActiveClick(playlistId)}
							/>
							<div>{playlistLibrary[playlistId].playlistName}</div>
							<div>
								<Button onClick={playlistLoadClick(playlistId)}>Load</Button>
							</div>
						</GridRow>
					))}
				</RadioGroup>
			</Grid>
		</section>
	);
};
