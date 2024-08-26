"use client";

import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import * as tunings from "@/features/music/tunings.json";

export const TuningTitle = () => {
	const { getValues } = useDashboardState();
	const [instrument, instrumentTuningName] = getValues([
		DashboardStateKey.INSTRUMENT,
		DashboardStateKey.INSTRUMENT_TUNING,
	]);

	const instrumentTuningsMap = instrument
		? tunings[instrument as keyof typeof tunings]
		: {};
	const tuning = (
		instrumentTuningsMap[
			instrumentTuningName as keyof typeof instrumentTuningsMap
		] as string[] | undefined
	)?.join(" ");

	return (
		<>
			<div>Tuning{tuning ? `: ` : null}</div>
			<div className="overflow-hidden text-ellipsis text-nowrap">
				{instrumentTuningName} - {tuning?.replace("b", "♭")}
			</div>
		</>
	);
};
