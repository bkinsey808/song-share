import { JSX } from "react";

import { CellProps } from "./types";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/features/app-store/useAppStore";

export const ActiveRadioCell = ({ songId }: CellProps): JSX.Element => {
	const { fuid, songActiveClick } = useAppStore();

	return (
		<div className="grid items-center justify-center">
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
	);
};
