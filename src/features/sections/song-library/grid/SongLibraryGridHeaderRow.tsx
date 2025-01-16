"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { JSX } from "react";

import { SongLibrarySort } from "../grid-form/consts";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";
import { GridHeader } from "@/features/grid/GridHeader";

export const SongLibraryGridHeaderRow = (): JSX.Element => {
	const { songLibrarySort, songLibrarySortSet } = useAppStore();

	return (
		<GridHeader>
			<div></div>
			<Button
				variant="outline"
				className="justify-start font-bold"
				onClick={() => {
					if (songLibrarySort === SongLibrarySort.SONG_NAME_ASC) {
						songLibrarySortSet(SongLibrarySort.SONG_NAME_DESC)();
					} else {
						songLibrarySortSet(SongLibrarySort.SONG_NAME_ASC)();
					}
				}}
			>
				<span className="flex gap-[0.3rem] align-middle">
					<span className="mt-[0.2rem]">
						{songLibrarySort === SongLibrarySort.SONG_NAME_ASC ? (
							<ArrowUpIcon />
						) : null}
						{songLibrarySort === SongLibrarySort.SONG_NAME_DESC ? (
							<ArrowDownIcon />
						) : null}
					</span>
					Song Name
				</span>
			</Button>
			<div>Key</div>
			<div>Options</div>
		</GridHeader>
	);
};
SongLibraryGridHeaderRow.gridRow = true;
