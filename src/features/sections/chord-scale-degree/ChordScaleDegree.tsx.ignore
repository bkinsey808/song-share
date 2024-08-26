"use client";

import Link from "next/link";

import { DashboardStateKey } from "@/app/d/enums";
import { AppState } from "@/app/d/types";
import { useDashboardState } from "@/app/d/useDashboardState";
import { degrees } from "@/features/music/degrees";
import { getCasedRomanNumeral } from "@/features/music/getCasedRomanNumeral";
import { getInKeyScale } from "@/features/music/getInKeyScale";
import { getNoteFromNumber } from "@/features/music/getNoteFromNumber";
import { getNoteNumber } from "@/features/music/getNoteNumber";
import { romanNumerals } from "@/features/music/romanNumerals";
import { getSciBySpelling } from "@/features/music/sci";

export const ChordScaleDegree = ({ scaleIndex }: { scaleIndex: number }) => {
	const { getValues, setValues, getUrl } = useDashboardState();

	const [keyNote, scale, chord, chordScaleDegree] = getValues([
		DashboardStateKey.KEY_NOTE,
		DashboardStateKey.SCALE,
		DashboardStateKey.CHORD,
		DashboardStateKey.CHORD_SCALE_DEGREE,
	]);

	const linkScaleDegree = degrees[scaleIndex];
	const inKeyScale = getInKeyScale({
		scale,
		chord,
		chordScaleDegree: linkScaleDegree,
		keyNote,
	});

	const romanNumeral = romanNumerals[scaleIndex];
	const casedRomanNumeral = getCasedRomanNumeral({
		romanNumeral,
		scale,
	});

	const keyNoteNumber = getNoteNumber(keyNote);
	const chordStartingNoteNumber =
		keyNoteNumber !== undefined ? (keyNoteNumber + scaleIndex) % 12 : undefined;
	const chordStartingNote =
		chordStartingNoteNumber !== undefined
			? getNoteFromNumber({
					noteNumber: chordStartingNoteNumber,
					includeOctave: false,
				})
			: undefined;

	const sci = getSciBySpelling(chord);

	const newState: Partial<AppState> = {
		[DashboardStateKey.CHORD_SCALE_DEGREE]: linkScaleDegree,
		[DashboardStateKey.POSITION]: [],
	};
	const url = getUrl(newState);

	return (
		<Link
			data-title="Chord Scale Degree"
			data-in-key-scale={inKeyScale}
			href={url}
			className="mr-[-0.1rem] break-all border border-current p-[0.4rem] text-center [&[data-in-key-scale='true']]:bg-[var(--color-cell-background-in-scale)]"
			onClick={(e) => {
				e.preventDefault();
				setValues(newState);
				return false;
			}}
		>
			<div
				data-selected={linkScaleDegree === chordScaleDegree}
				className="h-full rounded-full border border-transparent [&[data-selected='true']]:border-current"
			>
				<div>{casedRomanNumeral?.replace("b", "♭")}</div>
				{chordStartingNote ? (
					<div>({chordStartingNote?.replace("b", "♭")})</div>
				) : null}
				{sci?.txtCode}
			</div>
		</Link>
	);
};
