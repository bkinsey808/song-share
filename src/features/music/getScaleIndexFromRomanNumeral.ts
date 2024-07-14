import { romanNumerals } from "./romanNumerals";

export const getScaleIndexFromRomanNumeral = (
	romanNumeral?: string | undefined,
) => {
	if (romanNumeral === undefined) {
		return undefined;
	}
	const index = romanNumerals.findIndex(
		(numeral) => numeral?.toLowerCase() === romanNumeral?.toLowerCase(),
	);

	if (index === -1) {
		return undefined;
	}

	return index;
};
