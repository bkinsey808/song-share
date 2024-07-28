"use client";

import { DashboardStateKey } from "@/app/d/enums";
import { useDashboardState } from "@/app/d/useDashboardState";

export const ChordSpellingTitle = () => {
	const { getValue } = useDashboardState();
	const chord = getValue(DashboardStateKey.CHORD);
	const selectedChordParts = chord;
	const [, ...selectedChordSpellingArray] = selectedChordParts;
	const selectedChordSpelling = selectedChordSpellingArray.join(" ");

	return <span>Chord Spelling: {selectedChordSpelling.replace("b", "♭")}</span>;
};
