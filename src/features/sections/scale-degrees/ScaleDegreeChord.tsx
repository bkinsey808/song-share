"ues client";

import Link from "next/link";

import { getChords } from "./getChords";
import { DashboardStateKey } from "@/app/d/enums";
import { AppState } from "@/app/d/types";
import { useDashboardState } from "@/app/d/useDashboardState";
import { degrees } from "@/features/music/degrees";
import { getScaleIndexFromRomanNumeral } from "@/features/music/getScaleIndexFromRomanNumeral";
import { romanNumerals } from "@/features/music/romanNumerals";

interface ScaleDegreeChordProps {
	sci:
		| NonNullable<NonNullable<ReturnType<typeof getChords>>[number]>["sci"]
		| undefined;
	romanNumeral: string;
}

export const ScaleDegreeChord = ({
	sci,
	romanNumeral,
}: ScaleDegreeChordProps) => {
	const { getValues, setValues, getUrl } = useDashboardState();

	const newChord = sci?.txtSpelling?.split(",") ?? ([] as string[]);

	const [selectedChord, selectedChordScaleDegree] = getValues([
		DashboardStateKey.CHORD,
		DashboardStateKey.CHORD_SCALE_DEGREE,
	]);

	const chordScaleDegreeNumber =
		selectedChordScaleDegree === undefined
			? undefined
			: degrees.indexOf(selectedChordScaleDegree);

	const selectedChordRomanNumeral =
		chordScaleDegreeNumber === undefined
			? undefined
			: romanNumerals[chordScaleDegreeNumber];
	const selectedChordSpelling = selectedChord.join("-");

	const selected =
		sci?.txtSpelling?.replaceAll(",", "-") === selectedChordSpelling &&
		romanNumeral.toLowerCase() === selectedChordRomanNumeral?.toLowerCase();

	const scaleIndex = getScaleIndexFromRomanNumeral(romanNumeral);
	const scaleDegree =
		scaleIndex === undefined ? undefined : degrees[scaleIndex];

	const linkState: Partial<AppState> = {
		[DashboardStateKey.CHORD_SCALE_DEGREE]: scaleDegree ?? "1",
		[DashboardStateKey.CHORD]: newChord,
		[DashboardStateKey.POSITION]: [],
	};
	const url = getUrl(linkState);

	return (
		<Link
			data-title="Scale Degree Chord"
			data-selected={selected}
			className="flex h-[2rem] cursor-pointer items-center rounded-full border border-transparent px-[0.4rem] [&[data-selected='true']]:border-current"
			href={url}
			onClick={(e) => {
				e.preventDefault();
				setValues(linkState);
				return false;
			}}
		>
			{sci?.txtCode}
		</Link>
	);
};
