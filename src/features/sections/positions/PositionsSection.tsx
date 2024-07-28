"use client";

import { useMemo } from "react";

import { Position } from "./Position";
import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { getPositions } from "@/features/music/getPositions";

export const PositionsSection = () => {
	const { getValues } = useDashboardState();
	const [chordScaleDegree, chord, keyNote, tuning, maxFrets] = getValues([
		DashboardStateKey.CHORD_SCALE_DEGREE,
		DashboardStateKey.CHORD,
		DashboardStateKey.KEY_NOTE,
		DashboardStateKey.TUNING,
		DashboardStateKey.MAX_FRETS,
	]);

	const positions = useMemo(
		() =>
			getPositions({
				chordScaleDegree,
				chord,
				keyNote,
				tuning,
				maxFrets,
				maxFretSpan: 4,
				maxMuted: 1,
			}),
		[chordScaleDegree, chord, keyNote, tuning, maxFrets],
	);

	return (
		<section
			data-title="Positions Section"
			className="flex flex-wrap gap-x-[1rem]"
		>
			{positions?.map((position) => (
				<Position key={position.join("-")} position={position} />
			))}
		</section>
	);
};
