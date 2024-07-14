import { getSciNumbers } from "./getSciNumbers";
import { getSpellingFromNoteNumber } from "./getSpellingFromNoteNumber";
import { romanNumerals } from "./romanNumerals";
import { Scale } from "./types";

export const getRomanNumerals = (scale: Scale) => {
	if (!scale) {
		return [];
	}

	const scaleNumbers = getSciNumbers(scale);

	return scaleNumbers.map((scaleNumber, index) => {
		const modeNumbers = [
			...scaleNumbers.slice(index),
			...scaleNumbers.slice(0, index),
		]
			// next subtract the first scale number from all the scale numbers
			.map((innerScaleNumber) => (innerScaleNumber - scaleNumber + 12) % 12);

		const modeSpellings = modeNumbers.map((modeNumber) =>
			getSpellingFromNoteNumber(modeNumber),
		);

		const hasMajorThird = modeSpellings.includes("3");
		const hasMinorThird = modeSpellings.includes("b3");
		const isLowerCase = hasMinorThird && !hasMajorThird;

		return isLowerCase
			? romanNumerals[scaleNumber].toLowerCase()
			: romanNumerals[scaleNumber];
	});
};
