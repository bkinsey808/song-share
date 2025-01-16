"use client";

import { JSX } from "react";

import { SongLibraryGridForm } from "../grid-form/SongLibraryGridForm";
import { ActiveRadioCell } from "./ActiveRadioCell";
import { OptionsCell } from "./OptionsCell";
import { SongKeyCell } from "./SongKeyCell";
import { SongNameCell } from "./SongNameCell";
import { SongNameHeaderCell } from "./SongNameHeaderCell";
import { useSortedFilteredSongIds } from "./useSortedFilteredSongIds";
import { RadioGroup } from "@/components/ui/radio-group";
import { useAppStore } from "@/features/app-store/useAppStore";
import { tw } from "@/features/global/tw";
import { Grid } from "@/features/grid/Grid";
import { GridHeader } from "@/features/grid/GridHeader";
import { GridRow } from "@/features/grid/GridRow";

export const SongLibraryGrid = (): JSX.Element => {
	const { songActiveId, isSignedIn } = useAppStore();

	const songIds = useSortedFilteredSongIds();

	return (
		<>
			<SongLibraryGridForm />
			<RadioGroup
				name="songActiveId"
				id="songActiveId"
				value={songActiveId ?? ""}
				disabled={!isSignedIn}
			>
				<Grid
					fixedClassName={tw`grid-cols-[1.5rem,15rem]`}
					scrollingClassName={tw`grid-cols-[2rem,4rem]`}
				>
					<GridHeader>
						<div></div>
						<SongNameHeaderCell />
						<div>Key</div>
						<div>Options</div>
					</GridHeader>
					{songIds.map((songId) => (
						<GridRow key={songId}>
							<ActiveRadioCell songId={songId} />
							<SongNameCell songId={songId} />
							<SongKeyCell songId={songId} />
							<OptionsCell songId={songId} />
						</GridRow>
					))}
				</Grid>
			</RadioGroup>
		</>
	);
};
