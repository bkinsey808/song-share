"use client";

import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";
import { degrees } from "@/features/music/degrees";
import { getCasedRomanNumeral } from "@/features/music/getCasedRomanNumeral";
import { romanNumerals } from "@/features/music/romanNumerals";
import { getSciBySpelling } from "@/features/music/sci";

export const ChordTitle = () => {
	const { getValues } = useDashboardState();
	const [chord, scale, chordScaleDegree] = getValues([
		DashboardStateKey.CHORD,
		DashboardStateKey.SCALE,
		DashboardStateKey.CHORD_SCALE_DEGREE,
	]);
	const chordScaleDegreeNumber = chordScaleDegree
		? degrees.indexOf(chordScaleDegree)
		: undefined;
	const selectedChordRomanNumeral =
		chordScaleDegreeNumber === undefined
			? undefined
			: romanNumerals[chordScaleDegreeNumber];
	const sci = getSciBySpelling(chord);
	const casedRomanNumeral = getCasedRomanNumeral({
		romanNumeral: selectedChordRomanNumeral,
		scale,
	});

	return (
		<div>
			Chord
			{chord
				? `: ${casedRomanNumeral?.replace("b", "♭") ?? ""} ${sci?.txtCode} ( ${chord.map((spellingElement) => spellingElement.replace("b", "♭")).join(" ")} ) ${sci?.txtName}`
				: null}
		</div>
	);
};
