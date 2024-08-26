"use client";

import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { getRomanNumerals } from "@/features/music/getRomanNumerals";

export const ScaleDegreesTitle = () => {
	const { getValue } = useDashboardState();
	const scale = getValue(DashboardStateKey.SCALE);

	return (
		<>
			Scale Degrees{scale.length ? `: ` : null}
			{getRomanNumerals(scale).map((romanNumeral) => {
				return <div key={romanNumeral}>{romanNumeral.replace("b", "♭")}</div>;
			})}
		</>
	);
};
