"use client";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";
import { getKeys } from "@/features/global/getKeys";

export const SongSetLibrarySection = () => {
	const {
		songSetLibrary,
		songSetLoadClick,
		songSetActiveId,
		songSetActiveClick,
		usernameGet,
	} = useAppStore();
	const songSetIds = getKeys(songSetLibrary);

	return (
		<section data-title="Song Set Library Section" className="p-[1rem]">
			<Grid gridClassName="grid-cols-[1.5rem,3fr,2fr,1fr]">
				<GridHeader>
					<div></div>
					<div>Song Set Name</div>
					<div>Sharer</div>
					<div>Options</div>
				</GridHeader>
				<RadioGroup
					name="songSetActiveId"
					id="songSetActiveId"
					value={songSetActiveId ?? ""}
				>
					{songSetIds.map((songSetId) => (
						<GridRow key={songSetId}>
							<RadioGroupItem
								className="self-center"
								id={songSetId}
								value={songSetId}
								onClick={songSetActiveClick(songSetId)}
							/>
							<div>{songSetLibrary[songSetId].songSetName}</div>
							<div>{usernameGet(songSetLibrary[songSetId].sharer)}</div>
							<div>
								<Button onClick={songSetLoadClick(songSetId)}>Load</Button>
							</div>
						</GridRow>
					))}
				</RadioGroup>
			</Grid>
		</section>
	);
};
