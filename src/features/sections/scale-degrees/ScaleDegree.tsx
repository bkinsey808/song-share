"use client";

import { ScaleDegreeChord } from "./ScaleDegreeChord";
import { getChords } from "./getChords";
import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { romanNumerals } from "@/features/music/romanNumerals";

interface ScaleDegreeProps {
	romanNumeral: string;
}

export const ScaleDegree = ({ romanNumeral }: ScaleDegreeProps) => {
	const { getValue } = useDashboardState();
	const scale = getValue(DashboardStateKey.SCALE);

	const romanNumeralIndex = romanNumerals.findIndex(
		(r) => r.toLowerCase() === romanNumeral.toLowerCase(),
	);
	const chords = getChords({
		scale,
		scaleIndex: romanNumeralIndex,
	});

	return (
		<div className="flex flex-row gap-[0.1rem]">
			<div className="flex min-w-[2rem] items-center justify-center border border-current bg-[var(--color-cell-background-in-scale)] text-lg font-bold text-[hsl(var(--background))]">
				{romanNumeral}
			</div>
			<div className="flex flex-row flex-wrap gap-[0.2rem] align-baseline">
				{chords?.map((chord) => {
					return (
						<ScaleDegreeChord
							key={chord?.sci?.txtSpelling}
							romanNumeral={romanNumeral}
							sci={chord?.sci}
						/>
					);
				})}
			</div>
		</div>
	);
};
