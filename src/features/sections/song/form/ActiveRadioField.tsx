import { JSX } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppStore } from "@/features/app-store/useAppStore";

export const ActiveRadioFormField = (): JSX.Element | null => {
	const { songId, songActiveId, songActiveClick } = useAppStore();

	if (!songId) {
		return null;
	}

	return (
		<RadioGroup
			name="songActiveId"
			id="songActiveId"
			value={songActiveId ?? ""}
		>
			<RadioGroupItem
				className="self-center"
				id={songId}
				value={songId}
				onClick={songActiveClick({
					songId,
				})}
			/>
		</RadioGroup>
	);
};
