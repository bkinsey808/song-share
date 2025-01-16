import { TrashIcon } from "@radix-ui/react-icons";
import { JSX } from "react";

import { CellProps } from "./types";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/features/app-store/useAppStore";

export const OptionsCell = ({ songId }: CellProps): JSX.Element => {
	const { isSharer, songDeleteClick } = useAppStore();
	return (
		<div>
			{isSharer(songId) ? (
				<Button
					type="button"
					variant="outline"
					size="icon"
					className="size-8 shrink-0"
					onClick={songDeleteClick(songId)}
				>
					<TrashIcon className="size-4 text-destructive" aria-hidden="true" />
					<span className="sr-only">Delete Song</span>
				</Button>
			) : null}
		</div>
	);
};
