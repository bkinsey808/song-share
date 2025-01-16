import { JSX } from "react";

import { CellProps } from "./types";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";

export const SongNameCell = ({ songId }: CellProps): JSX.Element => {
	const { songLoadClick, songNameGet } = useAppStore();

	return (
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
	);
};
