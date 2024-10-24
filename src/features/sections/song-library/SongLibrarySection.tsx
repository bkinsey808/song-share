"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

import { songLibrarySort, songLibrarySortData } from "./consts";
import { useSortedSongIds } from "./slice";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/features/app-store/useAppStore";
import { Grid, GridHeader, GridRow } from "@/features/design-system/Grid";

export const SongLibrarySection = () => {
	const {
		// songLibrary,
		songLoadClick,
		songActiveId,
		songNameGet,
		songActiveClick,
		fuid,
		songLibrarySortSet,
	} = useAppStore();
	const songIds = useSortedSongIds();

	return (
		<section data-title="Song Library Section">
			<Grid gridClassName="grid-cols-[1.5rem,3fr,1fr]">
				<GridHeader>
					<div></div>
					<div>
						Song Name
						<Button
							variant="outline"
							className="p-0"
							onClick={songLibrarySortSet(songLibrarySort.SONG_NAME_ASC)}
							title={songLibrarySortData[songLibrarySort.SONG_NAME_ASC].label}
						>
							<ArrowUpIcon />
						</Button>
						<Button
							variant="outline"
							className="p-0"
							onClick={songLibrarySortSet(songLibrarySort.SONG_NAME_DESC)}
							title={songLibrarySortData[songLibrarySort.SONG_NAME_DESC].label}
						>
							<ArrowDownIcon />
						</Button>
					</div>
					<div>Options</div>
				</GridHeader>
				<RadioGroup
					name="songActiveId"
					id="songActiveId"
					value={songActiveId ?? ""}
				>
					{songIds.map((songId) => (
						<GridRow key={songId}>
							<div className="align-center grid justify-center">
								<RadioGroupItem
									className="self-center"
									id={songId}
									disabled={!!fuid}
									value={songId}
									onClick={songActiveClick({
										songId,
									})}
								/>
							</div>

							<div>
								<Button
									variant="outline"
									className="min-h-[2rem] w-full justify-start"
									onClick={songLoadClick(songId)}
									title="Load song"
								>
									{songNameGet(songId)}
								</Button>
							</div>
							<div></div>
						</GridRow>
					))}
				</RadioGroup>
			</Grid>
		</section>
	);
};
