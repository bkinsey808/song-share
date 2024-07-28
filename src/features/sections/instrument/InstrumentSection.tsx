"use client";

import { Section } from "../sections";
import { TuningSection } from "../tuning/TuningSection";
import { TuningTitle } from "../tuning/TuningTitle";
import { DashboardAccordion } from "@/app/d/DashboardAccordion";
import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { getKeys } from "@/features/global/getKeys";
import * as tunings from "@/features/music/tunings.json";

const instruments = getKeys(tunings).filter(
	(instrumentName) => String(instrumentName) !== "default",
);

export const InstrumentSection = () => {
	const { getValue, setValue, toggleAccordion } = useDashboardState();

	return (
		<section data-title="Instrument Section">
			<div className="grid grid-cols-[repeat(3,1fr)]">
				{instruments.map((instrument) => (
					<button
						key={instrument}
						className="mr-[-0.1rem] h-full border border-current p-[0.6rem] text-center"
						onClick={() => {
							setValue(DashboardStateKey.INSTRUMENT, instrument);
							setValue(DashboardStateKey.INSTRUMENT_TUNING, "");
							setValue(DashboardStateKey.TUNING, []);
							toggleAccordion(Section.TUNING, true);
						}}
					>
						<div
							data-selected={
								instrument === getValue(DashboardStateKey.INSTRUMENT)
							}
							className="w-full rounded-full border border-transparent py-[0.4rem] text-center [&[data-selected='true']]:border-current"
						>
							{instrument}
						</div>
					</button>
				))}
			</div>

			<DashboardAccordion
				key={Section.TUNING}
				id={Section.TUNING}
				title={<TuningTitle />}
			>
				<TuningSection />
			</DashboardAccordion>
		</section>
	);
};
