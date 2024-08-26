"use client";

import { DashboardStateKey, SelectCellToSet } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { getScaleDegree } from "@/features/music/getScaleDegree";
import { isCellInPosition } from "@/features/music/isCellInPosition";
import { isNoteInScale } from "@/features/music/isNoteInScale";
import { transposeNote } from "@/features/music/transposeNote";

export const FretboardCell = ({
	course,
	fret,
}: {
	course: number;
	fret: number;
}) => {
	const { getValues, toggleScaleDegree, togglePositionElement } =
		useDashboardState();
	const [keyNote, scale, tuning, position, selectCellToSet] = getValues([
		DashboardStateKey.KEY_NOTE,
		DashboardStateKey.SCALE,
		DashboardStateKey.TUNING,
		DashboardStateKey.POSITION,
		DashboardStateKey.SELECT_CELL_TO_SET,
	]);

	const openNote = tuning[course];
	const note = transposeNote(openNote, fret);
	const scaleDegree = getScaleDegree(keyNote, note);

	const noteInScale = isNoteInScale({ keyNote, scale, note });
	const noteInPosition = isCellInPosition({ position, fret, course });

	return (
		<div
			data-title={`Fretboard Cell - fret ${fret} of course ${course} is ${note}`}
			data-in-scale={noteInScale}
			data-in-position={noteInPosition}
			className="grid grid-cols-[2rem_1fr_2rem] border-4 border-solid bg-[var(--color-cell-background)] [&[data-in-scale='true']]:bg-[var(--color-cell-background-in-scale)] [&[data-in-scale='true']]:text-[hsl(var(--background))]"
			onClick={() => {
				switch (selectCellToSet) {
					case SelectCellToSet.SCALE:
						return toggleScaleDegree(scaleDegree);
					case SelectCellToSet.POSITION:
						return togglePositionElement(fret, course);
				}
			}}
		>
			<div className="col-[2] flex justify-center rounded-full border-4 border-transparent text-center [[data-in-position='true']>&]:border-current">
				{note?.replace("b", "♭")}
				<br />
				{scaleDegree?.replace("b", "♭")}
			</div>
		</div>
	);
};
