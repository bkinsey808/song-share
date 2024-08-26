"use client";

import { useMemo } from "react";

import { DashboardStateKey } from "@/app/d/enums";
import { AppState } from "@/app/d/types";
import { useDashboardState } from "@/app/d/useDashboardState";
import { getKeys } from "@/features/global/getKeys";
import * as tunings from "@/features/music/tunings.json";

export const TuningSection = () => {
	const { getValues, setValues } = useDashboardState();
	const [instrument, instrumentTuning] = getValues([
		DashboardStateKey.INSTRUMENT,
		DashboardStateKey.INSTRUMENT_TUNING,
	]);

	const instrumentTuningsMap = useMemo(
		() => (instrument ? tunings[instrument as keyof typeof tunings] : {}),
		[instrument],
	);

	const instrumentTuningNames: string[] = useMemo(
		() => getKeys(instrumentTuningsMap),
		[instrumentTuningsMap],
	);

	return (
		<section data-title="Tuning Section">
			<div className="grid grid-cols-[repeat(2,1fr)]">
				{instrumentTuningNames.map((instrumentTuningName) => {
					const tuning = instrumentTuningsMap[
						instrumentTuningName as keyof typeof instrumentTuningsMap
					] as string[];

					const newState: Partial<AppState> = {
						[DashboardStateKey.INSTRUMENT_TUNING]: instrumentTuningName,
						[DashboardStateKey.TUNING]: tuning,
					};

					return (
						<button
							key={instrumentTuningName}
							className="mr-[-0.1rem] h-full border border-current p-[0.6rem] text-center"
							onClick={() => {
								setValues(newState);
							}}
						>
							<div
								data-selected={instrumentTuningName === instrumentTuning}
								className="w-full rounded-full border border-transparent py-[0.4rem] text-center [&[data-selected='true']]:border-current"
							>
								<div>{instrumentTuningName}</div>
								<div>{tuning.join(" ")}</div>
							</div>
						</button>
					);
				})}
			</div>
		</section>
	);
};
