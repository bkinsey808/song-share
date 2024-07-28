"use client";

import { ScaleDegree } from "./ScaleDegree";
import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { getRomanNumerals } from "@/features/music/getRomanNumerals";

export const ScaleDegreesSection = () => {
	const { getValue } = useDashboardState();
	const scale = getValue(DashboardStateKey.SCALE);

	return (
		<section
			data-title="Scale Degrees Section"
			className="flex flex-col gap-[0.5rem]"
		>
			{getRomanNumerals(scale)?.map((romanNumeral) => (
				<ScaleDegree key={romanNumeral} romanNumeral={romanNumeral} />
			))}
		</section>
	);
};
