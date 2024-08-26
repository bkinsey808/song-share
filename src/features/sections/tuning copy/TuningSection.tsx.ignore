"use client";

import { Input } from "@/features/design-system/form/Input";
import { getKeys } from "@/features/global/getKeys";
import * as tunings from "@/features/music/tunings.json";

// transform an object in the form of:
// {
//   "Ukulele": {
//     "Soprano, Standard, Concert, Re-entrant": ["G4", "C4", "E4", "A4"],
//     "G": ["D4", "G4", "B4", "E4"],
//     "Open G, Taro Patch": ["G4", "C4", "E4", "G4"],
//     "C Wahine": ["G4", "B4", "E4", "G4"],
//     "D": ["A4", "D4", "Gb4", "B4"],
//     "Baritone, Standard, Common": ["D3", "G3", "B3", "E4"],
//     "Bass": ["E2", "A2", "D3", "G3"],
//     "Contrabass, Ubass": ["E1", "A1", "D2", "G2"],
//     "High D": ["D4", "G3", "B3", "E4"],
//     "Sopranino, D6": ["A4", "D4", "Gb4", "B4"],
//     "Tenor": ["G4", "C4", "E4", "A4"],
//     "G6": ["D4", "G4", "B4", "E4"],
//     "C6": ["A4", "D4", "F4", "B4"],
//     "A6": ["E4", "A4", "C#4", "Gb4"],
//     "D6": ["B4", "E4", "Gb4", "B4"],
//     "Low G": ["G3", "C4", "B4", "E5"],
//     "Pocket": ["D5", "G4", "B4", "E5"],
//     "Slide": ["G4", "C4", "E4", "Bb4"]
//   },
//   "Guitar": {
//     "Standard": ["E2", "A2", "D3", "G3", "B3", "E4"],
//     "Drop D": ["D2", "A2", "D3", "G3", "B3", "E4"],
//     "Double Drop D": ["D2", "A2", "D3", "G3", "B3", "D4"],
//     "DADGAD": ["D2", "A2", "D3", "G3", "A3", "D4"],
//     "Open D": ["D2", "A2", "D3", "Gb3", "A3", "D4"],
//     "Open G": ["D2", "G2", "D3", "G3", "B3", "D4"],
//     "Lute": ["E2", "A2", "D3", "Gb3", "B3", "E4"],
//     "Nashville": ["E2", "A2", "D3", "G3", "B3", "E4"],
//     "Irish": ["E2", "A2", "D3", "G3", "A3", "D4"]

//   },
//   "Charango": {
//     "Standard": ["G4", "C4", "E4", "A4", "E5"],
//     "Argentine": ["C4", "F4", "A4", "D4", "A4"],
//     "Gm7/Bb": ["F4", "Bb5", "C4", "G4", "D5"]
//   }
// }

// to an object in ths form of:
// const dataListMap = {
// 	["Ukulele - Soprano, Standard, Concert, Re-entrant [G4 C4 E4 A4]"]: {
// 		instrument: "Ukulele",
// 		instrumentTuningName: "Soprano, Standard, Concert, Re-entrant",
// 		tuning: ["G4", "C4", "E4", "A4"],
// 	},
//   ["Ukulele - G [D4 G4 B4 E4]"]: {
//     instrument: "Ukulele",
//     instrumentTuningName: "G",
//     tuning: ["D4", "G4", "B4", "E4"],
//   },
//   ["Ukulele - Open G, Taro Patch [G4 C4 E4 G4]"]: {
//     instrument: "Ukulele",
//     instrumentTuningName: "Open G, Taro Patch",
//     tuning: ["G4", "C4", "E4", "G4"],
//   },
//   ["Ukulele - C Wahine [G4 B4 E4 G4]"]: {
//     instrument: "Ukulele",
//     instrumentTuningName: "C Wahine",
//     tuning: ["G4", "B4", "E4", "G4"],
//   },
//   ["Ukulele - D [A4 D4 Gb4 B4]"]: {
//     instrument: "Ukulele",
//     instrumentTuningName: "D",
//     tuning: ["A4", "D4", "Gb4", "B4"],
//   },
//   ["Ukulele - Baritone, Standard, Common [D3 G3 B3 E4]"]: {
//     instrument: "Ukulele",
//     instrumentTuningName: "Baritone, Standard, Common",
//     tuning: ["D3", "G3", "B3", "E4"],
//   },
//   ["Ukulele - Bass [E2 A2 D3 G3]"]: {
//     instrument: "Ukulele",
//     instrumentTuningName: "Bass",
//     tuning: ["E2", "A2", "D3", "G3"],
//   },
//   ["Ukulele - Contrabass, Ubass [E1 A1 D2 G2]"]: {
//     instrument: "Ukulele",
//     instrumentTuningName: "Contrabass, Ubass",
//     tuning: ["E1", "A1", "D2", "G2"],
//   },
//   ... and so on
// };

const instrumentNames = getKeys(tunings);

const dataListMap = instrumentNames.reduce(
	(acc, instrumentName) => {
		const instrument = tunings[instrumentName];
		const instrumentTuningNames: string[] = getKeys(instrument);

		const dataListMap = instrumentTuningNames.reduce(
			(acc, instrumentTuningName) => {
				const tuning: string[] =
					instrument[instrumentTuningName as keyof typeof instrument];

				if (!Array.isArray(tuning)) {
					return acc;
				}
				const tuningString = tuning.join(" ");

				const key = `${instrumentName} - ${instrumentTuningName} [${tuningString}]`;

				return {
					...acc,
					[key]: {
						instrument: instrumentName,
						instrumentTuningName,
						tuning,
					},
				};
			},
			{} as Record<
				string,
				{ instrument: string; instrumentTuningName: string; tuning: string[] }
			>,
		);

		return { ...acc, ...dataListMap };
	},
	{} as Record<
		string,
		{ instrument: string; instrumentTuningName: string; tuning: string[] }
	>,
);

export const TuningSection = () => {
	return (
		<section data-title="Tuning Section">
			<Input
				list="tuning-list"
				onBlur={(e) => {
					const value = e.target.value;
					const completedOption = getKeys(dataListMap).find((option) =>
						option.startsWith(value),
					);
					if (!completedOption) {
						return;
					}
					e.target.value = completedOption;
				}}
			/>

			<datalist id="tuning-list">
				{getKeys(dataListMap).map((option) => (
					<option key={option} value={option} />
				))}
			</datalist>
		</section>
	);
};
