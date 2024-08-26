"use client";

import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { degrees } from "@/features/music/degrees";
import { getCasedRomanNumeral } from "@/features/music/getCasedRomanNumeral";
import { getNoteFromNumber } from "@/features/music/getNoteFromNumber";
import { getNoteNumber } from "@/features/music/getNoteNumber";
import { romanNumerals } from "@/features/music/romanNumerals";

export const ChordScaleDegreeTitle = () => {
	const { getValues } = useDashboardState();
	const [chordScaleDegree, keyNote, scale] = getValues([
		DashboardStateKey.CHORD_SCALE_DEGREE,
		DashboardStateKey.KEY_NOTE,
		DashboardStateKey.SCALE,
	]);
	const chordScaleDegreeNumber = chordScaleDegree
		? degrees.indexOf(chordScaleDegree)
		: undefined;
	const romanNumeral = chordScaleDegreeNumber
		? romanNumerals[chordScaleDegreeNumber]
		: undefined;

	const casedRomanNumeral = getCasedRomanNumeral({
		romanNumeral,
		scale,
	});

	const romanNumeralIndex = romanNumerals.findIndex(
		(r) => r?.toLowerCase() === romanNumeral?.toLowerCase(),
	);
	const keyNoteNumber = getNoteNumber(keyNote) ?? 0;
	const chordStartingNoteNumber = (keyNoteNumber + romanNumeralIndex) % 12;
	const chordStartingNote = getNoteFromNumber({
		noteNumber: chordStartingNoteNumber,
		includeOctave: false,
	});

	return (
		<span>
			Chord Scale Degree
			{casedRomanNumeral
				? `: ${casedRomanNumeral?.replace("b", "♭")} (
			${chordStartingNote.replace("b", "♭")})`
				: null}
		</span>
	);
};
