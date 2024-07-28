"use client";

import { FretboardCell } from "./FretboardCell";
import { FretboardControls } from "./FretboardControls";
import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { range } from "@/features/math/range";

export const FretboardSection = () => {
	const { getValues } = useDashboardState();
	const [tuning, maxFrets] = getValues([
		DashboardStateKey.TUNING,
		DashboardStateKey.MAX_FRETS,
		DashboardStateKey.SELECT_CELL_TO_SET,
	]);

	return (
		<section data-title="Fretboard Section">
			<FretboardControls />
			<div
				data-title="Fretboard Grid"
				style={{
					"--max-frets": maxFrets,
					"--courses": tuning.length,
				}}
				className="grid grid-flow-col grid-cols-[1.5rem_repeat(var(--courses),minmax(0,1fr))] grid-rows-[2rem_1fr_0.25rem_repeat(calc(var(--max-frets)-1),1fr)] gap-[0.25rem]"
			>
				<div
					data-title="Zeroth fret"
					className="col-span-full row-[2] bg-[hsl(var(--background))]"
				></div>

				{range(maxFrets).map((fret) => (
					<div
						key={fret}
						style={{
							"--fret": fret + (fret > 0 ? 2 : 1),
						}}
						className="col-start-1 row-[calc(var(--fret)+1)] grid items-center"
						data-title={`Fret ${fret}`}
					>
						F{fret}
					</div>
				))}

				{range(tuning.length).map((course) => (
					<div
						key={`course-${course}`}
						style={{
							"--course": course + 1,
						}}
						className="row-1 col-[calc(var(--course)+1)] flex justify-center"
					>
						<span>Course {course}</span>
					</div>
				))}
				{range(tuning.length).map((course) =>
					range(maxFrets).map((fret) => (
						<div
							data-title="Fretboard cell wrapper"
							key={`${course}-${fret}`}
							style={{
								"--course": course + 1,
								"--fret": fret + (fret > 0 ? 2 : 1),
							}}
							className="col-[calc(var(--course)+1)] row-[calc(var(--fret)+1)]"
						>
							<FretboardCell course={course} fret={fret} />
						</div>
					)),
				)}
			</div>
		</section>
	);
};
