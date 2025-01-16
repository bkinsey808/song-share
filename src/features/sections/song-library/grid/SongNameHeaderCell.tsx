import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { JSX } from "react";

import { SongLibrarySort } from "../grid-form/consts";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";

export const SongNameHeaderCell = (): JSX.Element => {
	const { songLibrarySort, songLibrarySortSet } = useAppStore();

	return (
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
	);
};
